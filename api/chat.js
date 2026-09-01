import { matchLegalTopic, getContactCtaFooter, LEGAL_DISCLAIMER, isWithinCallingHours } from './_legal_knowledge.js';
import { checkRateLimit, getClientIp, sanitizeInput } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);

  // Rate Limiting: 15 queries per 5 minutes per IP
  const isAllowed = checkRateLimit(`chat_${clientIp}`, 15, 5 * 60 * 1000);
  if (!isAllowed) {
    return res.status(429).json({
      success: false,
      error: 'You have sent several queries in a short time. Please wait a moment or connect directly with our helpline.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const rawMessage = body.message || body.query || '';

    // Validate Input Length (Max 500 characters)
    if (!rawMessage || typeof rawMessage !== 'string' || rawMessage.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Please enter a legal query or question.' });
    }

    if (rawMessage.length > 500) {
      return res.status(400).json({ success: false, error: 'Query is too long. Please summarize your question in under 500 characters.' });
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
        reply: `Namaste! Main **Dastavez Legal Info Assistant** hoon.

Main kewal general legal information aur documentation guidance provide karta hoon. Main individual legal strategy, case guarantee ya system internals provide nahi karta.

Aap apna legal query simple shabdo mein pooch sakte hain (Jaise: Unpaid salary, Vehicle NOC, Cheque bounce, ya Marriage registration).`,
        cta: getContactCtaFooter()
      });
    }

    // Process Query through Authoritative Knowledge Engine
    const match = matchLegalTopic(cleanQuery);
    const contactCta = getContactCtaFooter();

    let reply = '';

    if (match && match.isEmergency) {
      reply = match.response;
    } else if (match && match.topic) {
      const t = match.topic;
      reply = `**${t.category} – General Information:**

${t.summary.map(s => `• ${s}`).join('\n')}

${t.caution ? `⚠️ **Important:** ${t.caution}\n\n` : ''}**Next Steps:** ${t.nextSteps}

---
*यह सामान्य कानूनी जानकारी है; आपके case ke facts aur documents dekhkar specific opinion alag ho sakti hai.*`;
    } else {
      // General legal information response adhering to 3-6 short points structure
      reply = `Aapke prashn ke sambandh mein general legal information:

• Bharat mein kisi bhi legal matter ka hal applicable central aur state laws, dates aur facts par depend karta hai.
• Criminal matters mein 1 July 2024 se nayi BNS/BNSS lagoo hai; usse pehle ke mamlon par IPC/CrPC lagu rehti hai.
• Kisi bhi notice, complaint ya agreement ke mamle mein written proofs aur timelines sabse critical hote hain.
• Facts ya documents ki specific review ke bina koi definitive outcome ya guarantee nahi di ja sakti.

**Next Step:** Apne documents aur facts ke specific assessment ke liye DASTAVEZ MITRA desk se sampark karein.

---
*यह सामान्य कानूनी जानकारी है, व्यक्तिगत कानूनी राय नहीं.*`;
    }

    return res.status(200).json({
      success: true,
      reply,
      disclaimer: LEGAL_DISCLAIMER,
      cta: contactCta,
      timeInfo: {
        isCallingHours: isWithinCallingHours(),
        whatsappNumber: '9871592002',
        callingNumber: '9540403071'
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Unable to process query at the moment. Please reach out via WhatsApp at 9871592002.'
    });
  }
}
