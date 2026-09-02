/**
 * DASTAVEZ MITRA - Legal Mitra Knowledge Engine
 * Authoritative Indian Legal Information System
 * 
 * Sources: India Code, Ministry of Law and Justice, Supreme Court of India,
 * High Court of Punjab & Haryana, Official Central & State Gazette.
 * 
 * Strict Guidelines:
 * - Provides general legal information only; not a substitute for an advocate/lawyer.
 * - Current vs Legacy laws: BNS/BNSS/BSA (w.e.f 1 July 2024) vs IPC/CrPC/IEA (prior matters).
 * - Flags dates, transitional provisions, jurisdiction, and amendments for verification.
 * - Concise, actionable 3-5 bullet points.
 * - Always routes to WhatsApp: 9871592002 | Call: 9540403071 (9 AM - 7 PM).
 */

export const LEGAL_DISCLAIMER = "This is general legal information and not a substitute for professional legal advice. Applicability may vary depending on specific facts, dates, and local jurisdiction.";

export const BOT_IDENTITY = {
  name: "Legal Mitra",
  title: "Legal Information Assistant",
  organization: "DASTAVEZ MITRA",
  whatsappNumber: "9871592002",
  callingNumber: "9540403071",
  callingHours: "9:00 AM – 7:00 PM IST"
};

/**
 * Check if current time is within calling hours (9:00 AM - 7:00 PM IST)
 */
export function isWithinCallingHours() {
  try {
    const now = new Date();
    const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istString);
    const hours = istDate.getHours();
    return hours >= 9 && hours < 19;
  } catch (err) {
    const now = new Date();
    const totalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes() + 330;
    const istHours = Math.floor(((totalMinutes % 1440) + 1440) % 1440 / 60);
    return istHours >= 9 && istHours < 19;
  }
}

/**
 * Generate time-aware Call & WhatsApp footer
 */
export function getContactCtaFooter() {
  const isOpen = isWithinCallingHours();
  if (isOpen) {
    return {
      isOpen: true,
      text: "Expert guidance ya document assistance ke liye contact karein:\n📞 Call: 9540403071 (9 AM – 7 PM) | 💬 WhatsApp: 9871592002",
      callText: "Call: 9540403071",
      waText: "WhatsApp: 9871592002",
      badge: "Calling Support Online (9 AM – 7 PM)"
    };
  } else {
    return {
      isOpen: false,
      text: "Call support available 9 AM – 7 PM (9540403071). Abhi 24/7 WhatsApp message bhej sakte hain (9871592002).",
      callText: "Call Available 9 AM–7 PM (9540403071)",
      waText: "WhatsApp: 9871592002 (24/7)",
      badge: "Call: 9 AM – 7 PM | WhatsApp 24/7"
    };
  }
}

/**
 * Comprehensive Indian Legal Knowledge Categories & Matchers
 */
export const LEGAL_TOPICS = [
  // 1. Criminal Law - BNS / BNSS / BSA vs Legacy IPC / CrPC / IEA
  {
    id: "criminal-bns-ipc-framework",
    keywords: ["bns", "ipc", "criminal", "fir", "police", "crime", "420", "dhokha", "fraud", "theft", "chori", "379", "302", "murder", "307", "marpeet", "assault", "new law", "naya kanoon", "1 july 2024"],
    category: "Criminal Law (BNS 2023 vs IPC 1860)",
    statute: "Bharatiya Nyaya Sanhita, 2023 & Indian Penal Code, 1860",
    summary: [
      "1 July 2024 se nayi criminal code Bharatiya Nyaya Sanhita (BNS) poore Bharat mein lagoo ho chuki hai.",
      "1 July 2024 ya uske baad ghatit incidents/offences par BNS ke naye sections lagu hote hain (e.g. Cheating/Fraud ab Section 318 BNS hai, jo pehle IPC 420 tha; Theft ab Section 303 BNS hai).",
      "1 July 2024 se pehle ke mamlon par legacy Indian Penal Code (IPC) ke sections hi lagte hain (as per Section 358 BNS savings & transitional provisions).",
      "Exact legal provision incident ki date of occurrence aur FIR facts par depend karta hai; ambiguous dates par specific date verification zaroori hai."
    ],
    nextSteps: "FIR copy ya complaint facts verify karwake correct sections ke liye DASTAVEZ MITRA desk se connect karein."
  },
  {
    id: "criminal-procedure-bail-bnss",
    keywords: ["bail", "zamanat", "arrest", "giraftari", "bnss", "crpc", "summons", "warrant", "41a", "notice", "thana", "police station", "anticipatory bail"],
    category: "Criminal Procedure (BNSS 2023 & CrPC 1973)",
    statute: "Bharatiya Nagarik Suraksha Sanhita, 2023 & Code of Criminal Procedure, 1973",
    summary: [
      "Criminal procedure mein 1 July 2024 se Bharatiya Nagarik Suraksha Sanhita (BNSS) lagu ho chuki hai.",
      "Police notice (Section 35 BNSS, formerly 41A CrPC) aane par prescribed samay par investigation join karna anivarya hota hai.",
      "Bailable offences mein bail right ke roop mein milti hai; non-bailable offences mein judicial discretion (Session/High Court) par nirbhar hota hai.",
      "Arrest se pehle Anticipatory Bail (Section 482 BNSS / 438 CrPC) ke liye Sessions Court ya High Court mein petition move ki ja sakti hai."
    ],
    caution: "Police inquiry ya notice ke mamle mein delayed response se bachein aur tatkal legal assistance lein.",
    nextSteps: "Notice ya complaint draft ke sath immediate legal guidance prapt karein."
  },

  // 2. Evidence Law - BSA 2023 vs IEA 1872
  {
    id: "evidence-electronic-records-bsa",
    keywords: ["evidence", "bsa", "electronic record", "whatsapp chat proof", "call recording", "cctv", "65b", "saboot", "gawahi", "witness", "documentary proof"],
    category: "Law of Evidence (BSA 2023 & Indian Evidence Act)",
    statute: "Bharatiya Sakshya Adhiniyam, 2023 (BSA) & Indian Evidence Act, 1872",
    summary: [
      "1 July 2024 se Bharatiya Sakshya Adhiniyam (BSA) lagu hai jo electronic aur digital records ko primary evidence ke roop mein maanyata deta hai.",
      "WhatsApp chats, emails, digital transactions aur CCTV footage court mein saboot ke roop mein pesh kiye ja sakte hain.",
      "Electronic evidence ke sath statutory certificate (Section 63 BSA, pehle Section 65B IEA) anivarya hota hai.",
      "Original device, hash value aur secondary copies ki chain of custody surakshit rakhna aavashyak hai."
    ],
    nextSteps: "Digital records aur chats ke statutory certificate drafting ke liye DASTAVEZ MITRA desk se sampark karein."
  },

  // 3. Cheque Bounce (Negotiable Instruments Act Section 138)
  {
    id: "cheque-bounce-ni-act",
    keywords: ["cheque bounce", "check bounce", "cheque", "dishonour", "138", "ni act", "insufficient funds", "stop payment", "bounced cheque", "bank memo"],
    category: "Cheque Bounce (NI Act Section 138)",
    statute: "Negotiable Instruments Act, 1881",
    summary: [
      "Cheque dishonour (funds insufficient / stop payment) hone par bank se Return Memo prapt hota hai.",
      "Bank memo tareekh se **30 dino ke bheetar** drawer (cheque dene wale) ko statutory Legal Demand Notice bhejna anivarya hai.",
      "Notice milne ke baad drawer ko payment karne ke liye **15 dino ka samay** milta hai.",
      "Yadi 15 din mein payment nahi hoti, toh agle **30 dino ke bheetar** competent Magistrate Court mein Section 138 complaint file karni hoti hai."
    ],
    caution: "30-day notice limitation period expire hone ke baad Section 138 remedy bar ho sakti hai. Timelines sabse critical hain.",
    nextSteps: "Original cheque, return memo aur postal receipt ke sath notice draft karwayein."
  },

  // 4. Labour & Employment Law
  {
    id: "employment-salary-labour-law",
    keywords: ["salary", "unpaid salary", "employer", "company", "vetan", "tankhwah", "job termination", "resignation", "notice period", "pf", "gratuity", "labour code", "labour court", "full and final", "fnf"],
    category: "Labour & Employment Law",
    statute: "Code on Wages, 2019 / Payment of Wages Act, 1936 & Industrial Disputes Act, 1947",
    summary: [
      "Company ya employer dwara salary roke jane par applicable labour rules aur contract provisions ke tahat remedies milti hain.",
      "Pehle appointment letter, salary slips, bank statements aur written email correspondence preserve karein.",
      "Employer ko clear formal Legal Demand Notice bhejna pehla zaroori procedural step hota hai.",
      "Payment na milne par Labour Commissioner Office mein formal complaint ya civil recovery suit file kiya ja sakta hai."
    ],
    caution: "Remedy employee category (workman vs managerial), employment terms aur jurisdiction par depend karti hai.",
    nextSteps: "Employment communication ke sath formal notice draft karwane ke liye sampark karein."
  },

  // 5. Consumer Protection Law
  {
    id: "consumer-complaint-protection",
    keywords: ["consumer", "grahak", "defective product", "deficiency in service", "refund", "warranty", "guarantee", "fraud seller", "e-commerce complaint", "consumer court", "dcdrc", "flipkart", "amazon complaint"],
    category: "Consumer Protection Law",
    statute: "Consumer Protection Act, 2019",
    summary: [
      "Kharide gaye saman mein defect ya service mein deficiency hone par Consumer Commission mein relief mil sakti hai.",
      "Pehle National Consumer Helpline (NCH - 1915 / consumerhelpline.gov.in) par online grievance darj karein.",
      "Samadhan na milne par District Consumer Disputes Redressal Commission (DCDRC) mein formal complaint file hoti hai.",
      "Bill, tax invoice, warranty card, payment receipts aur service correspondence zaroori saboot hote hain."
    ],
    caution: "Consumer complaint file karne ka standard limitation period cause of action se 2 saal hota hai.",
    nextSteps: "Purchase proof aur correspondence ke sath consumer notice draft karwayein."
  },

  // 6. Marriage & Family Law
  {
    id: "marriage-family-legal-framework",
    keywords: ["marriage", "shaadi", "vivah", "court marriage", "arya samaj", "divorce", "talaq", "maintenance", "kharcha", "custody", "hindu marriage act", "special marriage act", "498a", "dv act"],
    category: "Marriage & Family Documentation",
    statute: "Hindu Marriage Act, 1955 / Special Marriage Act, 1954 & Domestic Violence Act, 2005",
    summary: [
      "Legal marriage ke liye ladke ki aayu 21 varsh aur ladki ki aayu 18 varsh hona mandatory hai.",
      "Marriage solemnization ke baad local SDM / Marriage Registrar office se official Government Certificate prapt kiya jata hai.",
      "Matrimonial disputes mein mutual consent settlement, mediation ya family court procedures applicable hote hain.",
      "Maintenance aur custody ke mamle dono paksho ki financial capacity aur baccho ke welfare par tay hote hain."
    ],
    caution: "Court marriage aur registration timelines registrar appointment slots aur document verification par nirbhar hain.",
    nextSteps: "Marriage documentation aur affidavit checklist verify karwane ke liye sampark karein."
  },

  // 7. Property, Agreements & Power of Attorney
  {
    id: "property-agreement-power-of-attorney",
    keywords: ["property", "rent agreement", "lease", "sale deed", "registry", "tenant", "landlord", "kiraya", "eviction", "makan khali", "gpa", "spa", "power of attorney", "stamp paper", "notary"],
    category: "Property & Contract Documentation",
    statute: "Transfer of Property Act, 1882, Indian Contract Act, 1872 & Registration Act, 1908",
    summary: [
      "11 mahine se adhik ke rent/lease agreements ko Sub-Registrar office mein register karwana kanuni roop se anivarya hota hai.",
      "Immovable property se related Power of Attorney (GPA) par state stamp laws ke anusaar mandatory registration lagti hai.",
      "Tenant eviction ya security deposit dispute mein registered agreement aur formal legal notice pehla statutory step hota hai.",
      "Kisi bhi property deal mein title verification, non-encumbrance certificate aur chain of ownership check karna avashyak hai."
    ],
    nextSteps: "Agreement drafting, GPA/SPA aur stamp paper guidance ke liye DASTAVEZ MITRA desk se connect karein."
  },

  // 8. Wills, Succession & Legal Heir
  {
    id: "will-succession-legal-heir-law",
    keywords: ["will", "wasiyat", "testament", "legal heir", "varis", "succession", "property batwara", "partition", "inheritance", "death certificate", "ancestral property"],
    category: "Succession & Inheritance Law",
    statute: "Indian Succession Act, 1925 & Hindu Succession Act, 1956",
    summary: [
      "Will (Wasiyat) kisi vyakti dwara uski self-acquired property ke distribution ke liye legal declaration hoti hai.",
      "Will ka registration optional hota hai par dispute se bachane ke liye Sub-Registrar office mein registration recommended hoti hai.",
      "Bina Will ke death hone par property first-line legal heirs (spouse, children, mother) mein equal share mein distribute hoti hai.",
      "Bank balances, PF aur property transfer ke liye Tehsildar / Revenue authority se Legal Heir Certificate prapt karna hota hai."
    ],
    nextSteps: "Will drafting aur End-to-End Legal Heir Certificate assistance ke liye connect karein."
  },

  // 9. Motor Vehicle & RTO Laws
  {
    id: "motor-vehicle-rto-challan-law",
    keywords: ["rto", "traffic challan", "virtual court", "rc transfer", "form 28", "form 26", "form 35", "duplicate rc", "hp cancel", "driving licence", "road tax", "fitness certificate", "overloading challan"],
    category: "Motor Vehicles & RTO Law",
    statute: "Motor Vehicles Act, 1988 & Central Motor Vehicles Rules, 1989",
    summary: [
      "Vehicle RC transfer ke liye Form 29/30, seller-buyer affidavits, NCRB clearance aur insurance anivarya hote hain.",
      "Camera/e-challan virtual court portal ya traffic court Gurugram se statutory notice procedure ke tahat resolve hote hain.",
      "Inter-state transfer ke liye Form 28 NOC (3 copies + chassis pencil sketch) mandatory hoti hai.",
      "Commercial vehicle conversions (yellow to white plate) ke liye tax receipts, permit surrender aur RTO verification lagti hai."
    ],
    caution: "Services currently available in Gurugram/Haryana jurisdiction.",
    nextSteps: "Challan status check aur RTO paperwork verification ke liye DASTAVEZ MITRA se connect karein."
  }
];

/**
 * Intelligent Intent Matcher for User Legal Queries
 */
export function matchLegalTopic(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase().trim();

  // 1. Emergency safety check
  if (q.includes("murder") || q.includes("suicide") || q.includes("jaan ka khatra") || q.includes("kill") || q.includes("emergency") || q.includes("hostage") || q.includes("kidnap")) {
    return {
      isEmergency: true,
      response: `⚠️ **Emergency Alert**: Yadi aap ya koi vyakti tatkal khatre mein hai, toh kripya turant National Emergency Helpline **112** ya Police **100** par call karein.

Legal Mitra ek general legal information assistant hai aur emergency / on-ground police intervention provide nahi kar sakta.`
    };
  }

  // 2. Score matched topics based on weighted keyword occurrences
  let bestTopic = null;
  let maxScore = 0;

  for (const topic of LEGAL_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && maxScore >= 3) {
    return {
      isEmergency: false,
      topic: bestTopic
    };
  }

  return null;
}

/**
 * Build concise Legal Mitra answer when LLM API is offline or not configured
 */
export function buildLegalMitraAnswer(cleanQuery) {
  const match = matchLegalTopic(cleanQuery);

  if (match && match.isEmergency) {
    return match.response;
  }

  if (match && match.topic) {
    const t = match.topic;
    return `**${t.category} – General Information:**

${t.summary.map(s => `• ${s}`).join('\n')}

${t.caution ? `⚠️ **Important:** ${t.caution}\n\n` : ''}**Next Steps:** ${t.nextSteps}

---
*${LEGAL_DISCLAIMER}*`;
  }

  // General Legal Information Structure
  return `Aapke prashn ke sambandh mein general legal information:

• **Applicable Legal Framework:** Bharat mein kisi bhi legal matter ka hal matter ki date, facts, aur Central/State statutory rules par nirbhar karta hai.
• **Current vs Legacy Laws:** Criminal matters mein 1 July 2024 ke baad ke incidents par BNS/BNSS lagti hai; usse pehle ke mamlon par IPC/CrPC lagoo rehti hai.
• **Evidence & Documentation:** Kisi bhi notice, dispute ya agreement ke mamle mein written proofs, dates aur timeline compliance sabse critical hoti hai.
• **Verification Requirement:** Specific facts ya documents ki review ke bina koi definitive outcome ya court result promise nahi kiya ja sakta.

**Next Steps:** Apne documents aur facts ke specific assessment ke liye DASTAVEZ MITRA desk se sampark karein.

---
*${LEGAL_DISCLAIMER}*`;
}
