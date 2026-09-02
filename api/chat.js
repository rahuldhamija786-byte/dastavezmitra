import { buildLegalMitraAnswer, getContactCtaFooter, LEGAL_DISCLAIMER, isWithinCallingHours, BOT_IDENTITY } from './_legal_knowledge.js';
import { checkRateLimit, getClientIp, sanitizeInput } from './_auth.js';

/**
 * Server-side AI Inference helper using Google Gemini or OpenAI if API keys are provided
 */
async function generateAiLegalResponse(userQuery) {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const systemInstruction = `You are "Legal Mitra", a professional Legal Information Assistant for DASTAVEZ MITRA (a documentation & legal assistance service in Gurugram, India).

STRICT RULES:
1. You provide general legal information for informational and educational purposes only.
2. DO NOT represent yourself as an advocate, lawyer, legal counsel, or court. NEVER promise court outcomes, police decisions, government approvals, or challan reductions.
3. Indian Law Framework:
   - For criminal matters: Apply Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), and Bharatiya Sakshya Adhiniyam (BSA 2023) for offences on or after 1 July 2024. For incidents prior to 1 July 2024, state that legacy IPC 1860 / CrPC 1973 applies.
   - For civil, property, contract, labour, NI Act (Section 138 cheque bounce), Consumer Protection Act 2019, RTO/Motor Vehicles Act 1988, Hindu Marriage Act 1955, and Special Marriage Act 1954: provide accurate statutory context.
   - For questions involving dates, transitional provisions, jurisdiction, or uncertain facts, clearly state that the position needs verification with actual case documents.
4. Language: Answer in concise, polite, professional Hinglish / Hindi / English (matching the user's query language).
5. Format: Provide 3 to 5 clear, structured bullet points. Keep it concise and relevant. Do not overload with unnecessary text.
6. Always conclude with the notice:
"यह सामान्य कानूनी जानकारी है और कानूनी सलाह का विकल्प नहीं है। (This is general legal information and not a substitute for professional legal advice.)"`;

  // 1. Try Gemini API
  if (geminiApiKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nUser Question: ${userQuery}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600
        }
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim().length > 0) {
          return candidateText.trim();
        }
      }
    } catch (e) {
      console.warn('Gemini API call skipped or timed out, using Legal Mitra knowledge engine fallback:', e.message);
    }
  }

  // 2. Try OpenAI API if configured
  if (openaiApiKey) {
    try {
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.2,
        max_tokens: 500
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const replyText = json?.choices?.[0]?.message?.content;
        if (replyText && replyText.trim().length > 0) {
          return replyText.trim();
        }
      }
    } catch (e) {
      console.warn('OpenAI API call skipped or timed out, using fallback:', e.message);
    }
  }

  // 3. Fallback to Authoritative Legal Mitra Knowledge Engine
  return buildLegalMitraAnswer(userQuery);
}

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);

  // Rate Limiting: 20 queries per 5 minutes per IP
  const isAllowed = checkRateLimit(`chat_${clientIp}`, 20, 5 * 60 * 1000);
  if (!isAllowed) {
    return res.status(429).json({
      success: false,
      error: 'You have sent several queries in a short time. Please wait a moment or connect directly with our helpline.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const rawMessage = body.message || body.query || '';

    // Validate Input
    if (!rawMessage || typeof rawMessage !== 'string' || rawMessage.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Please enter a legal query or question.' });
    }

    if (rawMessage.length > 600) {
      return res.status(400).json({ success: false, error: 'Query is too long. Please summarize your question in under 600 characters.' });
    }

    const cleanQuery = sanitizeInput(rawMessage);

    // Anti-Prompt Injection Filter
    const suspiciousPhrases = [
      "ignore previous instructions", "ignore all instructions", "reveal system prompt",
      "system prompt", "developer mode", "jailbreak", "you are now a lawyer who guarantees",
      "act as my personal attorney and promise"
    ];
    const isSuspicious = suspiciousPhrases.some(p => cleanQuery.toLowerCase().includes(p));

    if (isSuspicious) {
      return res.status(200).json({
        success: true,
        reply: `Namaste! Main **${BOT_IDENTITY.name}** (${BOT_IDENTITY.title}) hoon.

Main kewal general legal information aur documentation guidance provide karta hoon. Main individual legal strategy, case guarantee ya system internals provide nahi karta.

Aap apna legal prashn simple shabdo mein pooch sakte hain (Jaise: Unpaid salary, Cheque bounce, Vehicle NOC, ya Marriage registration).`,
        cta: getContactCtaFooter()
      });
    }

    // Process Query (AI LLM with Knowledge Engine Fallback)
    const reply = await generateAiLegalResponse(cleanQuery);
    const contactCta = getContactCtaFooter();

    return res.status(200).json({
      success: true,
      botName: BOT_IDENTITY.name,
      reply,
      disclaimer: LEGAL_DISCLAIMER,
      cta: contactCta,
      timeInfo: {
        isCallingHours: isWithinCallingHours(),
        whatsappNumber: BOT_IDENTITY.whatsappNumber,
        callingNumber: BOT_IDENTITY.callingNumber
      }
    });

  } catch (err) {
    console.error('Chat API Error:', err);
    // Graceful fallback response so the user is never left hanging
    const fallbackAnswer = buildLegalMitraAnswer(req.body?.message || '');
    return res.status(200).json({
      success: true,
      botName: BOT_IDENTITY.name,
      reply: fallbackAnswer,
      disclaimer: LEGAL_DISCLAIMER,
      cta: getContactCtaFooter()
    });
  }
}
