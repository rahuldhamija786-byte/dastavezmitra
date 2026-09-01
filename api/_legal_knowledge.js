/**
 * DASTAVEZ MITRA - Authoritative Legal Information Knowledge Base
 * Sources: India Code, Ministry of Law and Justice, Supreme Court of India,
 * High Court of Punjab & Haryana, Official Central & State Gazette.
 * 
 * Strict Guideline: Provides educational/general legal information only.
 * Not legal advice or substitute for an advocate/legal practitioner.
 */

export const LEGAL_DISCLAIMER = "Dastavez Legal Info Assistant provides general legal information for educational and informational purposes only. It is not a substitute for individual legal advice, legal representation or professional opinion. Laws and procedures may change, and applicability depends on the facts and jurisdiction.";

export const EMERGENCY_CONTACTS = {
  nationalEmergency: "112",
  police: "100",
  womenHelpline: "1091",
  cyberCrimePortal: "cybercrime.gov.in (Helpline: 1930)"
};

/**
 * Curated knowledge entries across key Indian legal topics
 */
export const LEGAL_TOPICS = [
  // 1. Criminal Law - Current (BNS/BNSS/BSA) vs Legacy (IPC/CrPC/IEA)
  {
    id: "criminal-bns-ipc",
    keywords: ["bns", "ipc", "criminal", "420", "cheating", "fraud", "dhokhadhadi", "theft", "chori", "379", "302", "murder", "307", "assault", "marpeet", "fir", "police", "crime"],
    category: "Criminal Law (BNS & IPC)",
    statute: "Bharatiya Nyaya Sanhita, 2023 (BNS) & Indian Penal Code, 1860 (IPC)",
    effectiveDate: "01 July 2024 (BNS)",
    summary: [
      "1 July 2024 se nayi criminal code Bharatiya Nyaya Sanhita (BNS) lagoo ho chuki hai.",
      "1 July 2024 ya uske baad hue offences par BNS ke sections lagte hain (Jaise Cheating ab Section 318 BNS ke antargat aati hai, jo pehle IPC Section 420 thi).",
      "1 July 2024 se pehle hue incidents/offences par legacy Indian Penal Code (IPC) ke tahat karvayi hoti hai (as per savings/transitional provisions).",
      "Exact section offence ki tareekh (date of occurrence) aur FIR facts par nirbhar karta hai."
    ],
    nextSteps: "FIR copy ya complaint draft verify karne aur correct provision check karne ke liye legal expert se connect karein."
  },
  {
    id: "criminal-procedure-fir-bail",
    keywords: ["fir", "bail", "zamanat", "arrest", "giraftari", "police complaint", "thana", "bnss", "crpc", "warrant", "summons", "notice"],
    category: "Criminal Procedure (BNSS & CrPC)",
    statute: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) & Code of Criminal Procedure, 1973 (CrPC)",
    effectiveDate: "01 July 2024 (BNSS)",
    summary: [
      "Cognizable offences mein police station mein FIR (First Information Report) darj ki jaati hai (Section 173 BNSS).",
      "Arrest ya giraftari ki sthiti mein accused ke paas legal representation, grounds of arrest janne, aur bail application move karne ka adhikar hota hai.",
      "Bailable offences mein bail right ke roop mein police/court se milti hai; Non-bailable offences mein judicial discretion hoti hai.",
      "Anticipatory Bail (giraftari se pehle ki zamanat) Session Court ya High Court se demand ki ja sakti hai."
    ],
    caution: "Yadi giraftari ya police inquiry ka tatkal khatra hai, toh bina deri kiye qualified legal professional se vyaktigat salah lena uchit hai.",
    nextSteps: "Notice/Summons ya complaint copy ke sath turant court lawyer se sampark karein."
  },

  // 2. Labour & Employment Law
  {
    id: "employment-salary-wage-dispute",
    keywords: ["salary", "unpaid salary", "employer", "company", "vetan", "tankhwah", "job", "termination", "resignation", "notice period", "pf", "gratuity", "labour code", "labour court"],
    category: "Labour & Employment Law",
    statute: "Code on Wages, 2019 / Payment of Wages Act, 1936 & Industrial Disputes Act, 1947",
    effectiveDate: "Applicable Central/State Labour Rules",
    summary: [
      "Salary/wages na milne par employee ke paas applicable labour-law aur civil remedies ho sakti hain.",
      "Pehle appointment letter, salary slips, bank statements aur email communication preserve karein.",
      "Employer ko clear formal written legal notice / demand letter bhejna pehla zaroori step hota hai.",
      "Payment na hone par Labour Commissioner office mein complaint ya civil recovery suit file kiya ja sakta hai."
    ],
    caution: "Exact remedy employment contract, employee category (workman vs managerial), state jurisdiction aur establishment type par depend karti hai.",
    nextSteps: "Company communication aur salary records collect karke formal legal notice draft karwayein."
  },

  // 3. Negotiable Instruments Act (Cheque Bounce)
  {
    id: "cheque-bounce-ni-act",
    keywords: ["cheque bounce", "check bounce", "cheque", "dishonour", "138", "ni act", "insufficient funds", "stop payment", "bounced cheque"],
    category: "Cheque Bounce & Banking Law",
    statute: "Negotiable Instruments Act, 1881 (Section 138)",
    effectiveDate: "Substantive NI Act Law & Court Procedures",
    summary: [
      "Cheque dishonour hone par bank memo milne ke 30 dino ke bheetar drawer ko statutory Legal Notice bhejna anivarya hota hai.",
      "Notice receive hone ke baad drawer ko payment karne ke liye 15 dino ka statutory samay milta hai.",
      "Agar 15 din mein payment nahi aati, toh next 30 dino ke bheetar competent Magistrate Court mein Section 138 complaint file karni hoti hai.",
      "Limitation period (samay seema) ka palan karna isme sabse critical hota hai."
    ],
    caution: "Original cheque, return memo aur notice speed post receipt ko surakshit rakhein.",
    nextSteps: "30-day notice timeline expire hone se pehle turant notice draft karwayein."
  },

  // 4. Consumer Protection Law
  {
    id: "consumer-complaint-protection",
    keywords: ["consumer", "grahak", "defective product", "deficiency in service", "refund", "warranty", "guarantee", "fraud seller", "e-commerce complaint", "consumer court", "dcdrc"],
    category: "Consumer Protection",
    statute: "Consumer Protection Act, 2019",
    effectiveDate: "20 July 2020",
    summary: [
      "Kharide gaye product mein defect ya service mein deficiency hone par Consumer Commission mein complaint file ki ja sakti hai.",
      "Pehle National Consumer Helpline (NCH - 1915 / consumerhelpline.gov.in) par online complaint darj kar sakte hain.",
      "Samadhan na hone par District Consumer Disputes Redressal Commission (DCDRC) mein formal case file hota hai.",
      "Bill, invoice, warranty card, payment receipts aur correspondence sabut ke roop mein zaroori hote hain."
    ],
    caution: "Consumer complaint file karne ka standard limitation period cause of action se 2 saal hota hai.",
    nextSteps: "Purchase proof aur seller communication ke sath consumer notice ya complaint draft karein."
  },

  // 5. Marriage Registration & Family Documentation
  {
    id: "marriage-registration-process",
    keywords: ["marriage", "shaadi", "vivah", "marriage registration", "marriage certificate", "court marriage", "arya samaj marriage", "nikah", "special marriage act", "hindu marriage act"],
    category: "Marriage Documentation",
    statute: "Hindu Marriage Act, 1955 / Special Marriage Act, 1954 & Haryana Compulsory Registration of Marriages Act, 2008",
    effectiveDate: "Applicable Gurugram/Haryana Rules",
    summary: [
      "Gurugram mein shaadi ka legal certificate lene ke liye online portal par application draft karke Tehsil/SDM office mein verification hoti hai.",
      "Dono paksho ke identity proof (Aadhaar/Voter), 10th marksheet (DOB proof), Joint photos, Pandit certificate/Marriage bill aur 2 gawahon ke Aadhaar zaroori hote hain.",
      "Special Marriage Act ke tahat court marriage mein 30-day notice period aur objections process lagta hai.",
      "Arya Samaj marriage mein mandir rites ke baad SDM office se legal certificate issue karwaya jata hai."
    ],
    caution: "Dono paksho ki legal age (Boy: 21+, Girl: 18+) aur valid consent anivarya hai.",
    nextSteps: "DASTAVEZ MITRA se document checklist verify karwayein aur appointment schedule karein."
  },

  // 6. Affidavits, Agreements & Power of Attorney
  {
    id: "affidavit-agreement-documentation",
    keywords: ["affidavit", "agreement", "rent agreement", "live-in agreement", "stamp paper", "notary", "gpa", "spa", "power of attorney", "will", "wasiyat", "legal heir"],
    category: "Affidavits & Agreements",
    statute: "Indian Stamp Act, 1899 & Registration Act, 1908 (Haryana Amendments)",
    effectiveDate: "Current State Stamping Norms",
    summary: [
      "Affidavits swayam ki shapath par aadharit declaration hote hain jo prescribed e-stamp paper par notarized karwaye jate hain.",
      "Rent agreement ya commercial contracts dono paksho ki mutually agreed sharto par stamp duty ke sath execute hote hain.",
      "11 mahine se adhik ke rent agreement ya immovable property power of attorney ko Sub-Registrar office mein register karwana anivarya hota hai.",
      "Wills (Wasiyat) ka registration optional hota hai par dispute bachane ke liye recommended hota hai."
    ],
    caution: "Galat stamp duty denomination ya bina witness ke agreement legal validity mein kamzor ho sakta hai.",
    nextSteps: "DASTAVEZ MITRA desk par custom draft prepare karwayein."
  },

  // 7. Vehicle Documentation & RTO (Gurugram Specific)
  {
    id: "rto-vehicle-noc-challan",
    keywords: ["rto", "rta", "vehicle noc", "form 28", "form 26", "form 35", "duplicate rc", "hp cancel", "driving licence", "international dl", "traffic challan", "virtual court challan"],
    category: "Vehicle Documentation & RTO",
    statute: "Motor Vehicles Act, 1988 & Central Motor Vehicles Rules, 1989",
    effectiveDate: "Current Gurugram RTA / Sarathi & Parivahan Workflows",
    summary: [
      "Vehicle NOC Form 28 inter-state/inter-RTO transfer ke liye Form 28 (3 copies), pencil chassis sketch (3 copies), insurance, pollution aur NCRB report ke sath file hota hai.",
      "Duplicate RC ke liye Form 26, FIR/NCRB clearance, insurance aur address proof mandatory hota hai.",
      "HP Cancel (Loan removal) ke liye Bank NOC letter aur Form 35 (2 copies) RTO mein submit karna hota hai.",
      "Traffic camera / e-challan ko Parivahan virtual court portal ya traffic court Gurugram se niptara karwaya ja sakta hai."
    ],
    caution: "Services currently available in Gurugram only. Documents exact matching format mein hone chahiye.",
    nextSteps: "DASTAVEZ MITRA Gurugram Court desk par checklist verify karwayein."
  },

  // 8. Gazette Name Change
  {
    id: "gazette-name-change-process",
    keywords: ["gazette", "name change", "naam badalna", "spelling mistake", "newspaper advertisement", "under 18 name change", "official gazette"],
    category: "Gazette & Certificates",
    statute: "Department of Publication, Government of India Gazette Norms",
    effectiveDate: "Current Gazette Guidelines",
    summary: [
      "Official name change ke liye 3 main steps hote hain: 1) Notarized Affidavit, 2) Leading Newspapers mein Vigyapan (Ads), 3) Gazette Application submission.",
      "Under 18 (Minor) ke liye child ke 3 docs (Aadhaar, Birth Cert, School ID), parents ke docs aur 2 witnesses ke details lagte hain.",
      "Gazette notification aane ke baad passport, bank, marksheets aur identity cards mein official update ho jata hai."
    ],
    caution: "Government gazette publication standard legal proof hota hai jo all-India accept hota hai.",
    nextSteps: "DASTAVEZ MITRA Gurugram assistance desk se affidavit draft aur newspaper format prapt karein."
  }
];

/**
 * Check if current time in Asia/Kolkata is within calling hours (9:00 AM - 7:00 PM)
 * @returns {boolean}
 */
export function isWithinCallingHours() {
  try {
    const now = new Date();
    // Convert to IST
    const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istString);
    const hours = istDate.getHours();
    return hours >= 9 && hours < 19; // 9:00 AM to 6:59:59 PM (i.e. up to 7:00 PM)
  } catch (err) {
    // Fallback: check UTC+5:30
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const totalMinutes = utcHours * 60 + utcMinutes + 330; // +5.5 hours
    const istHours = Math.floor((totalMinutes % 1440) / 60);
    return istHours >= 9 && istHours < 19;
  }
}

/**
 * Generate time-aware call & WhatsApp footer
 */
export function getContactCtaFooter() {
  const isOpen = isWithinCallingHours();
  if (isOpen) {
    return {
      isOpen: true,
      text: "Expert opinion ke liye abhi call karein: 9540403071 | WhatsApp: 9871592002",
      callText: "Call Now: 9540403071",
      waText: "WhatsApp: 9871592002",
      badge: "Calling Support Online (9 AM – 7 PM)"
    };
  } else {
    return {
      isOpen: false,
      text: "Call support is available from 9:00 AM to 7:00 PM (9540403071). Abhi 24/7 WhatsApp message bhej sakte hain (9871592002).",
      callText: "Call Available 9 AM–7 PM (9540403071)",
      waText: "WhatsApp Now: 9871592002 (24/7)",
      badge: "Calling Hours: 9 AM – 7 PM | WhatsApp 24/7"
    };
  }
}

/**
 * Intent matcher for user queries
 */
export function matchLegalTopic(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase().trim();

  // 1. Emergency safety check
  if (q.includes("murder") || q.includes("suicide") || q.includes("jaan ka khatra") || q.includes("kill") || q.includes("emergency") || q.includes("hostage")) {
    return {
      isEmergency: true,
      response: `⚠️ **Emergency Alert**: Yadi aap ya koi anya vyakti tatkal khatre mein hai, toh kripya turant National Emergency Helpline **112** ya Police **100** par call karein.

Dastavez Legal Info Assistant emergency intervention provide nahi kar sakta.`
    };
  }

  // 2. Score matched topics
  let bestTopic = null;
  let maxScore = 0;

  for (const topic of LEGAL_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw)) {
        score += kw.length; // weight longer keyword matches
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
