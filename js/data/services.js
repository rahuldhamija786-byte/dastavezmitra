/**
 * DASTAVEZ MITRA - Centralized Services Data Store
 * All services configured with editable fields, priority sorting, and AI features.
 */

export const BRAND_INFO = {
  name: "DASTAVEZ MITRA",
  tagline: "Documentation & Assistance Services",
  headline: "Documentation Ka Kaam? DASTAVEZ MITRA Se Sampark Kijiye.",
  subheading: "RTO, Vehicle Documentation, Marriage Registration, Affidavit, Agreement aur anya documentation services ke liye assistance.",
  
  // Dedicated Separate Contact Numbers (STRICT: Only these numbers)
  whatsappNumber: "9871592002",
  callingNumber: "9540403071",
  contactNumbersDisplay: "WhatsApp: 9871592002 / 9540403071 | Call: 9871592002 / 9540403071",
  callingHoursNotice: "Calling Hours: 9 AM – 7 PM (WhatsApp available 24/7)",
  
  whatsappUrlPrefix: "https://wa.me/919871592002",
  serviceLocationNotice: "Services currently available in Gurugram only.",
  officeAddress: "Seat No. 4, R C Khatana Lane, Hall No. 8, District and Sessions Court, Gurugram",
  instagramHandle: "@dastavezmitra",
  instagramUrl: "https://www.instagram.com/dastavezmitra?igsh=MWFsdHBucm15eWZudg%3D%3D&utm_source=qr",
  facebookName: "DASTAVEZ MITRA",
  facebookUrl: "https://facebook.com",
  defaultWhatsappMessage: "Hello DASTAVEZ MITRA, I want information about documentation services.",
  disclaimer: "DASTAVEZ MITRA is a documentation and assistance service. Service availability, processing time, required documents and applicable procedures may vary depending on the service, authority and individual case. Information on this website is for general guidance and should be verified for the specific service."
};

export const SERVICE_CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "vehicle-rto", label: "Vehicle & RTO" },
  { id: "marriage", label: "Marriage Documentation" },
  { id: "affidavit-agreements", label: "Affidavits & Agreements" },
  { id: "power-of-attorney", label: "Power of Attorney & Wills" },
  { id: "identity-certificates", label: "Certificates & Gazette" },
  { id: "other", label: "Other Services" }
];

export const SERVICES = [
  // ==========================================
  // 1. VEHICLE & RTO SERVICES
  // ==========================================
  {
    id: "rc-transfer",
    slug: "rc-transfer",
    name: "RC Transfer",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "car",
    shortDescription: "Complete assistance for transferring vehicle registration certificate ownership between seller and buyer.",
    whoNeedsThis: "Individuals buying or selling pre-owned cars, two-wheelers, or commercial vehicles requiring official RC ownership transfer in Gurugram/Haryana.",
    hasConfirmedDocs: true,
    documents: [
      "Original RC",
      "Seller's Aadhaar Card",
      "Seller's PAN Card",
      "Buyer's Aadhaar Card",
      "Buyer's PAN Card",
      "Joint photograph of Seller and Buyer with the vehicle",
      "Insurance",
      "Pollution Certificate (PUC)",
      "NCRB",
      "Seller Affidavit",
      "Buyer Affidavit",
      "Seller & Buyer Forms"
    ],
    process: [
      "Connect on WhatsApp with vehicle registration and transfer details.",
      "Verify seller and buyer identity documents, affidavits, and joint vehicle photo.",
      "Compile Form 29/30, NCRB clearance, valid insurance, and PUC.",
      "Guidance on RTO application filing and ownership transfer tracking."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about RC Transfer.",
    notes: "Both Seller Affidavit and Buyer Affidavit along with joint photograph with vehicle are required for RC transfer."
  },
  {
    id: "rto",
    slug: "rto",
    name: "RTO",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "truck",
    shortDescription: "Comprehensive assistance for Road Tax, Fitness Certificate, Commercial to Private Conversion, and RTO Challans.",
    whoNeedsThis: "Private and commercial vehicle owners needing assistance with state road tax payment, fitness renewals, permit updates, conversion, and RTO challan resolution.",
    hasConfirmedDocs: true,
    subServices: [
      {
        id: "rto-road-tax",
        name: "Road Tax Payment",
        description: "Assistance with calculating, generating challans, and paying pending or annual/one-time road tax for private and commercial vehicles.",
        actionText: "Pay Road Tax"
      },
      {
        id: "rto-fitness-certificate",
        name: "Fitness Certificate Payment / Processing",
        description: "Complete documentation compilation, fee payment, and inspection guidance for commercial and transport vehicle fitness certificate renewal.",
        actionText: "Process Fitness"
      },
      {
        id: "rto-conversion",
        name: "Commercial Vehicle → Private Vehicle Conversion",
        description: "Procedural assistance and documentation for converting yellow-plate commercial/transport vehicles to white-plate private registration.",
        actionText: "Convert Vehicle"
      },
      {
        id: "rto-challan-assistance",
        name: "RTO Challan Payment / Assistance",
        description: "Verification and assistance for settling RTO departmental challans, including road-protection, overloading, and permit-related challans.",
        actionText: "Resolve RTO Challan"
      }
    ],
    documents: [
      "Vehicle RC Copy",
      "Current Insurance Policy",
      "Pollution Certificate (PUC)",
      "Owner's Aadhaar Card & PAN",
      "Previous Tax / Fitness Receipts (if applicable)",
      "Permit & Surrender Papers (for conversion)"
    ],
    process: [
      "Select your required RTO sub-service and connect via WhatsApp/Call.",
      "Share vehicle RC details and current document status for assessment.",
      "Receive detailed fee calculation, statutory requirement checklist, and draft forms.",
      "Step-by-step assistance through the authorized RTO / Parivahan portal workflow."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about RTO services.",
    notes: "RTO procedures and fee structures are governed by Haryana Transport Department regulations."
  },
  {
    id: "traffic-challan-assistance",
    slug: "traffic-challan",
    name: "Traffic Challan Assistance",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "alert-circle",
    shortDescription: "Guidance on checking pending e-challans, virtual court challans, compoundable notices, and court resolution assistance.",
    whoNeedsThis: "Vehicle owners with pending traffic camera challans, on-spot notices, or Virtual Court cases requiring documentation guidance.",
    hasConfirmedDocs: true,
    categorizedDocuments: [
      {
        groupTitle: "GENERAL VEHICLE DOCUMENTS",
        items: [
          "RC",
          "Insurance",
          "Pollution Certificate (PUC)",
          "Driver's Driving Licence",
          "Driver's Aadhaar Card",
          "Owner's Aadhaar Card"
        ]
      },
      {
        groupTitle: "FOR COMMERCIAL VEHICLES",
        items: [
          "Road Tax",
          "Fitness Certificate"
        ]
      },
      {
        groupTitle: "IF VEHICLE IS REGISTERED IN A COMPANY'S NAME",
        items: [
          "Company GST Certificate",
          "Authority Letter on the company's official letterhead",
          "Aadhaar Card of the authorized person"
        ]
      }
    ],
    documents: [
      "RC",
      "Insurance",
      "Pollution Certificate (PUC)",
      "Driver's Driving Licence",
      "Driver's Aadhaar Card",
      "Owner's Aadhaar Card",
      "Commercial: Road Tax & Fitness Certificate",
      "Company Vehicle: GST Certificate, Authority Letter & Auth Person Aadhaar"
    ],
    process: [
      "Share your vehicle registration number or challan number on WhatsApp.",
      "We check status across Parivahan, Traffic Police, and Virtual Court portals.",
      "Verify vehicle documents, commercial fitness/tax, or company authority letter.",
      "Receive guidance on online settlement or traffic court appearance in Gurugram."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Traffic Challan Assistance.",
    notes: "Challan settlement options depend on whether the challan is pending at the traffic department or transferred to the Virtual/Regular Court."
  },
  {
    id: "noc-vehicle-work",
    slug: "vehicle-noc-form-28",
    name: "Vehicle NOC – Form 28",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "file-check",
    shortDescription: "Assistance with Form 28 No Objection Certificate (NOC) documentation for inter-state and inter-RTO vehicle re-registration.",
    whoNeedsThis: "Vehicle owners relocating or selling their vehicle across state or RTO jurisdictions requiring Form 28 NOC.",
    hasConfirmedDocs: true,
    documents: [
      "Form 28 – 3 Copies",
      "Chassis Number Sketch with Pencil – 3 Copies",
      "Insurance Copy",
      "Pollution Certificate Copy",
      "Affidavit",
      "Seller Address Proof",
      "Purchaser Address Proof",
      "NCRB",
      "Picture of Both Parties with Vehicle"
    ],
    process: [
      "Reach out via WhatsApp with origin and destination RTO details.",
      "Prepare Form 28 – 3 copies along with Chassis Number Sketch with Pencil – 3 Copies.",
      "Verify NCRB clearance, insurance, pollution, and affidavit documentation.",
      "Submit application at RTO for NOC issuance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Vehicle NOC – Form 28.",
    notes: "Chassis Number Sketch with Pencil – 3 Copies and Form 28 – 3 Copies are mandatory for NOC processing."
  },
  {
    id: "international-driving-licence",
    slug: "international-driving-licence",
    name: "International Driving Licence",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "credit-card",
    shortDescription: "Complete documentation assistance for acquiring an International Driving Permit / Licence (IDP/IDL).",
    whoNeedsThis: "Indian driving licence holders planning to travel, visit, or drive vehicles abroad internationally.",
    hasConfirmedDocs: true,
    documents: [
      "Driving Licence (DL) Copy",
      "Visa Copy",
      "Passport Copy",
      "Ticket Copy",
      "Address Proof",
      "Mobile Number"
    ],
    process: [
      "Connect with DASTAVEZ MITRA on WhatsApp for International Driving Licence assistance.",
      "Verify your valid Indian DL, passport, and visa copy.",
      "Compile ticket copy, address proof, and contact details for application filing.",
      "Track International Driving Licence processing and issuance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about International Driving Licence.",
    notes: "Valid Indian Driving Licence, valid passport, and visa copy are required for processing."
  },
  {
    id: "learner-licence",
    slug: "learner-licence",
    name: "Learner Licence",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "credit-card",
    shortDescription: "Documentation support and application guidance for obtaining a Learner's Licence (LL).",
    whoNeedsThis: "New drivers applying for a Learner's Licence or needing assistance with Sarathi portal documentation.",
    hasConfirmedDocs: true,
    documents: [
      "1 Passport Size Photograph",
      "DOB Proof",
      "2 Address Proofs",
      "Blood Group",
      "Mobile Number",
      "Signature on Plain Paper"
    ],
    process: [
      "Share your Learner Licence requirement on WhatsApp.",
      "Verify DOB proof, 2 address proofs, photo, and signature format.",
      "Complete application drafting and slot booking guidance on the portal.",
      "Appear for the online/RTO learner test with verified documentation."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Learner Licence.",
    notes: "Ensure address proofs and DOB proof match exactly with official identification records."
  },
  {
    id: "duplicate-rc",
    slug: "duplicate-rc",
    name: "Duplicate RC",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "copy",
    shortDescription: "Documentation assistance for obtaining a duplicate Registration Certificate in case of loss, damage, or theft.",
    whoNeedsThis: "Vehicle owners whose original RC is misplaced, lost, damaged, or stolen.",
    hasConfirmedDocs: true,
    documents: [
      "Form 26",
      "FIR Copy",
      "Insurance Copy",
      "Pollution Certificate / PUC Copy",
      "NCRB Report",
      "Address Proof",
      "Affidavit"
    ],
    process: [
      "Contact DASTAVEZ MITRA on WhatsApp with your vehicle details.",
      "Prepare Form 26 and arrange FIR / NCRB clearance report.",
      "Compile vehicle insurance, pollution certificate, and address proof.",
      "Guidance on RTO application submission for duplicate RC issuance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Duplicate RC.",
    notes: "Form 26 and FIR/NCRB copy are essential prerequisites for duplicate RC processing."
  },
  {
    id: "hp-cancellation-hypothecation",
    slug: "hp-cancel",
    name: "HP Cancel",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "check-circle",
    shortDescription: "Documentation support for removing bank hypothecation/loan entry (HP Cancel) from vehicle RC.",
    whoNeedsThis: "Vehicle owners who have cleared their auto loan and need hypothecation removed from their registration certificate.",
    hasConfirmedDocs: true,
    documents: [
      "Form 35 – 2 Copies",
      "Bank NOC Letter",
      "Original RC",
      "Affidavit",
      "Insurance Copy",
      "Pollution Certificate Copy",
      "Address Proof"
    ],
    process: [
      "Connect on WhatsApp with bank NOC letter and Form 35 – 2 Copies.",
      "Verify bank seal, signature, and validity period on loan closure NOC.",
      "Prepare affidavit and RTO application file for HP cancellation.",
      "Submit at RTO for updated clean RC issuance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about HP Cancel.",
    notes: "Bank NOC letter is valid for a limited period; ensure timely submission along with Form 35 (2 copies)."
  },

  // ==========================================
  // 2. MARRIAGE DOCUMENTATION
  // ==========================================
  {
    id: "quick-marriage-assistance",
    slug: "quick-marriage-assistance",
    name: "Quick Marriage Assistance",
    category: "marriage",
    categoryName: "Marriage Documentation",
    icon: "zap",
    shortDescription: "End-to-end documentation guidance for expedited marriage solemnization, Arya Samaj wedding paperwork, and government registration.",
    whoNeedsThis: "Couples looking for quick, hassle-free documentation support for marriage solemnization rituals and legal registration without false guarantees.",
    hasConfirmedDocs: true,
    ageRequirementHindi: "विवाह हेतु लड़के की आयु 21 वर्ष तथा लड़की की आयु 18 वर्ष होना अनिवार्य है।",
    documents: [
      "Boy's Aadhaar Card",
      "Girl's Aadhaar Card",
      "Boy's Birth Proof (10th/Matriculation Marksheet OR Birth Certificate)",
      "Girl's Birth Proof (10th/Matriculation Marksheet OR Birth Certificate)",
      "Aadhaar Cards of 2 Witnesses"
    ],
    process: [
      "Connect via WhatsApp to verify age proofs, Aadhaar, and witness availability.",
      "Draft mandatory affidavits, mutual consent declarations, and paperwork dossier.",
      "Guidance for marriage solemnization / Vedic rites documentation.",
      "Follow-up guidance for Sub-Divisional Magistrate (SDM) / Registrar official registration."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Quick Marriage Assistance.",
    notes: "विवाह हेतु लड़के की आयु 21 वर्ष तथा लड़की की आयु 18 वर्ष होना अनिवार्य है। Registration timelines depend on registrar appointment slots and document verification."
  },
  {
    id: "marriage-registration",
    slug: "marriage-registration",
    name: "Marriage Registration",
    category: "marriage",
    categoryName: "Marriage Documentation",
    icon: "heart",
    shortDescription: "Documentation and appointment assistance for obtaining an official Government Marriage Registration Certificate.",
    whoNeedsThis: "Couples needing a formal marriage registration certificate for passport, visa, joint banking, or official records.",
    hasConfirmedDocs: true,
    hindiHeading: "शादी रजिस्टर करने हेतु आवश्यक दस्तावेज़",
    ageRequirementHindi: "विवाह हेतु लड़के की आयु 21 वर्ष तथा लड़की की आयु 18 वर्ष होना अनिवार्य है।",
    documents: [
      "पति-पत्नी के आधार कार्ड",
      "दोनों के दसवीं की मार्कशीट / जन्म प्रमाण पत्र",
      "दोनों के वोटर कार्ड",
      "एक जॉइंट फोटो सादे कपड़ों में",
      "दोनों की 1-1 पासपोर्ट साइज़ फोटो",
      "शादी की जगह का प्रमाण पत्र या बिल",
      "पंडित का आधार कार्ड",
      "शादी की 4 फोटो",
      "दो गवाहों के आधार कार्ड",
      "Family ID"
    ],
    process: [
      "Connect on WhatsApp to check applicable marriage acts and requirements.",
      "Gather and organize identity proofs, address proofs, and witness documents.",
      "Complete application form drafting and appointment scheduling guidance.",
      "Attend the verification appointment with complete paperwork."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Marriage Registration.",
    notes: "Marriage registration requirements depend on jurisdiction and governing acts (Hindu Marriage Act, Special Marriage Act, etc.)."
  },
  {
    id: "live-in-relationship-agreement",
    slug: "live-in-agreement",
    name: "Live-In Relationship Agreement",
    category: "affidavit-agreements",
    categoryName: "Affidavits & Agreements",
    icon: "users",
    shortDescription: "Drafting mutual cohabitation and live-in relationship agreements detailing mutual consent, terms, and understanding.",
    whoNeedsThis: "Adult couples living together seeking a clear written mutual declaration and understanding of terms and responsibilities.",
    hasConfirmedDocs: true,
    ageRequirementHindi: "दोनों पक्षों की आयु 18 वर्ष या उससे अधिक होना आवश्यक है।",
    documents: [
      "Boy's Aadhaar Card",
      "Girl's Aadhaar Card",
      "Boy's Birth Proof (10th/Matriculation Marksheet OR Birth Certificate)",
      "Girl's Birth Proof (10th/Matriculation Marksheet OR Birth Certificate)"
    ],
    process: [
      "Reach out on WhatsApp with your mutual details and agreed terms.",
      "Verify that both parties are 18+ years of age with valid birth and identity proofs.",
      "Receive customized draft agreement structured with mutually agreed terms.",
      "Execute the agreement on appropriate stamp paper with notarization guidance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Live-In Relationship Agreement.",
    notes: "दोनों पक्षों की आयु 18 वर्ष या उससे अधिक होना आवश्यक है। Agreements are drafted based on voluntary mutual consent."
  },

  // ==========================================
  // 3. AFFIDAVITS & AGREEMENTS (WITH EMBEDDED AI DRAFTING)
  // ==========================================
  {
    id: "affidavit",
    slug: "affidavit",
    name: "Affidavit",
    category: "affidavit-agreements",
    categoryName: "Affidavits & Agreements",
    icon: "file-text",
    shortDescription: "Preparation and drafting of all types of affidavits with an embedded interactive AI drafting assistant.",
    whoNeedsThis: "Anyone needing an official sworn statement or declaration for passport, name change, address discrepancy, date of birth, property, court, or government submission.",
    hasConfirmedDocs: true,
    hasAiDrafting: true,
    aiDraftingType: "affidavit",
    aiDraftingButtonText: "अपना Affidavit Draft करें",
    documents: [
      "Deponent's Aadhaar Card / Identity Proof",
      "Address Proof",
      "Relevant Supporting Documents (Marksheet, Marriage Certificate, Property papers, etc. depending on purpose)",
      "Photographs (where mandated by authority)"
    ],
    process: [
      "Use our embedded AI assistant 'अपना Affidavit Draft करें' or send requirement via WhatsApp.",
      "Provide purpose, deponent details, submitting authority, and relevant facts.",
      "Review your preliminary generated draft on-screen.",
      "Connect with DASTAVEZ MITRA desk for final verification, e-stamp printing, and notarization."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Affidavit preparation.",
    notes: "नोटरी के लिए आपकी व्यक्तिगत उपस्थिति अनिवार्य होगी। Stamp duty values vary by purpose and state regulations."
  },
  {
    id: "agreement-drafting",
    slug: "agreement",
    name: "Agreement Drafting",
    category: "affidavit-agreements",
    categoryName: "Affidavits & Agreements",
    icon: "clipboard",
    shortDescription: "Custom commercial and legal agreement drafting with our multi-party embedded AI questionnaire.",
    whoNeedsThis: "Landlords, tenants, vehicle owners, partners, vendors, and businesses needing tailored contracts with comprehensive legal clauses.",
    hasConfirmedDocs: true,
    hasAiDrafting: true,
    aiDraftingType: "agreement",
    aiDraftingButtonText: "अपना Agreement Draft करें",
    documents: [
      "Aadhaar & PAN Cards of All Parties (First Party, Second Party, etc.)",
      "Asset / Property / Vehicle Details & Registration Proof",
      "Commercial Terms (Rent, Consideration, Deposit, Duration, Start/End Dates)",
      "2 Witnesses' Identity Proofs"
    ],
    process: [
      "Launch 'अपना Agreement Draft करें' inside this section to answer interactive tailored questions.",
      "Specify agreement type (Rent, Partnership, Vehicle Sale/Rental, Service, Commercial, etc.) and all parties.",
      "Input key terms: consideration, responsibilities, default, dispute, notice, and termination clauses.",
      "Confirm summary and generate preliminary draft for final verification by DASTAVEZ MITRA."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Agreement Drafting.",
    notes: "Stamp duty and registration requirements vary depending on agreement type, tenure, and consideration amount."
  },

  // ==========================================
  // 4. POWER OF ATTORNEY & WILLS (WITH EMBEDDED AI DRAFTING)
  // ==========================================
  {
    id: "will-testament-documentation",
    slug: "will-testament-documentation",
    name: "Will / Testament Documentation",
    category: "power-of-attorney",
    categoryName: "Power of Attorney & Wills",
    icon: "feather",
    shortDescription: "Comprehensive testamentary succession drafting with our structured asset-by-asset AI assistant.",
    whoNeedsThis: "Individuals wishing to document precise distribution of movable and immovable assets among beneficiaries with conditional succession.",
    hasConfirmedDocs: true,
    hasAiDrafting: true,
    aiDraftingType: "will",
    aiDraftingButtonText: "अपनी Will Draft करें",
    documents: [
      "Testator's Aadhaar Card & Residential Address Proof",
      "Immovable Property Details (Registry, Allotment Letter, Share/Interest)",
      "Movable Asset Details (Bank Accounts, FDs, Lockers, Vehicles, Shares, Investments)",
      "Beneficiary Identity Details & Relationship Proof",
      "Aadhaar Cards of 2 Independent Witnesses",
      "Doctor's Fitness Certificate (Recommended for elderly testators)"
    ],
    process: [
      "Click 'अपनी Will Draft करें' for a guided step-by-step interview.",
      "Step 1: Input Testator details and identification particulars.",
      "Step 2: Add individual Immovable & Movable assets one by one.",
      "Step 3 & 4: Assign beneficiaries, shares, life interests, and special conditions.",
      "Step 5: Review complete asset-by-asset confirmation and generate preliminary draft."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Will / Testament Documentation.",
    notes: "Will drafting requires careful legal verification. Registration provides official record security."
  },
  {
    id: "gpa-spa",
    slug: "gpa-spa",
    name: "GPA / SPA",
    category: "power-of-attorney",
    categoryName: "Power of Attorney & Wills",
    icon: "award",
    shortDescription: "Drafting General Power of Attorney (GPA) and Special Power of Attorney (SPA) with embedded AI drafting assistant.",
    whoNeedsThis: "Property owners, NRIs, elderly individuals, or principals authorizing trusted representatives for general affairs or specific transactions.",
    hasConfirmedDocs: true,
    hasAiDrafting: true,
    aiDraftingType: "gpa-spa",
    aiDraftingButtonText: "अपना GPA / SPA Draft करें",
    documents: [
      "Aadhaar Card of Principal (Maker / Executant)",
      "Aadhaar Card of Attorney Holder (Representative)",
      "PAN Cards of Both Parties",
      "Property Papers / Matter / Vehicle Documents (subject of authorization)",
      "2 Witnesses' Aadhaar Cards & Photographs"
    ],
    process: [
      "Launch 'अपना GPA / SPA Draft करें' to specify whether GPA or SPA is required.",
      "Define scope of powers, matter/property details, duration, and limitations.",
      "Generate preliminary draft with defined authority clauses.",
      "Guidance on notary execution or Sub-Registrar registration assistance where available."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about GPA / SPA.",
    notes: "Notary GPA/SPA can be provided. Notary के लिए आपकी व्यक्तिगत उपस्थिति आवश्यक होगी। Registration availability depends on the applicable Tehsil/Sub-Registrar authority."
  },

  // ==========================================
  // 5. IDENTITY & CERTIFICATES
  // ==========================================
  {
    id: "legal-heir-certificate",
    slug: "legal-heir-certificate",
    name: "Legal Heir Certificate",
    category: "identity-certificates",
    categoryName: "Certificates & Gazette",
    icon: "user-check",
    shortDescription: "End-to-End Legal Heir Certificate assistance for claiming deceased person's property, bank accounts, and benefits.",
    whoNeedsThis: "Surviving family members (spouse, children, parents) needing official survivor certification for inheritance, bank claims, or property mutation.",
    hasConfirmedDocs: true,
    personalAppearanceNotice: "Affidavit के execution/notarization के लिए संबंधित व्यक्ति की व्यक्तिगत उपस्थिति आवश्यक होगी।",
    categorizedDocuments: [
      {
        groupTitle: "DECEASED PERSON DOCUMENTS",
        items: [
          "Death Certificate",
          "Aadhaar Card",
          "Passport Size Photograph"
        ]
      },
      {
        groupTitle: "LEGAL HEIRS DOCUMENTS (Spouse, Children, etc.)",
        items: [
          "Aadhaar Card of All Legal Heirs",
          "Passport Size Photograph of All Legal Heirs",
          "Affidavit (DASTAVEZ MITRA assists with preparation)"
        ]
      }
    ],
    documents: [
      "Deceased Person: Death Certificate, Aadhaar Card, Passport Size Photo",
      "Legal Heirs: Aadhaar Cards, Photos & Affidavits of all first-line legal heirs",
      "Family Tree / Ration Card / Parivar Pehchan Patra"
    ],
    processTitle: "End-to-End Legal Heir Certificate Assistance Process",
    process: [
      "Affidavits prepared and verified for all legal heirs.",
      "Legal Heir Certificate application file compiled with supporting records.",
      "Assistance for required Municipal Corporation verification / report.",
      "Assistance for required Patwari verification / report.",
      "Assistance for required Tehsildar verification / report.",
      "After required reports, assistance for issuance of Legal Heir Certificate through the Tehsildar."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Legal Heir Certificate.",
    notes: "Affidavit के execution/notarization के लिए संबंधित व्यक्ति की व्यक्तिगत उपस्थिति आवश्यक होगी। Final issuance remains subject to verification by the competent Revenue/Tehsildar authority."
  },
  {
    id: "gazette-name-change",
    slug: "gazette-name-change",
    name: "Gazette Notification / Name Change",
    category: "identity-certificates",
    categoryName: "Certificates & Gazette",
    icon: "book-open",
    shortDescription: "Step-by-step documentation guidance for official name change publication in the Gazette (Under 18 & 18+).",
    whoNeedsThis: "Parents/guardians of minors (under 18) and adults changing name, correcting discrepancies, or updating official records.",
    hasConfirmedDocs: true,
    gazetteSections: {
      under18: {
        title: "Under 18 – Required Documents",
        groups: [
          {
            title: "3 Documents of Child",
            items: ["Aadhaar Card", "Birth Certificate", "School ID"]
          },
          {
            title: "2 Documents of Father",
            items: ["Aadhaar Card", "Voter ID"]
          },
          {
            title: "2 Documents of Mother",
            items: ["Aadhaar Card", "Voter ID"]
          },
          {
            title: "Additional Documents",
            items: [
              "2 Passport Size Photographs Each",
              "2 Witnesses' Name, Address and Mobile Number"
            ]
          }
        ],
        serviceAddressNotice: "DASTAVEZ MITRA Office / Assistance Desk: Seat No. 4, R C Khatana Lane, Hall No. 8, District and Sessions Court, Gurugram"
      },
      above18: {
        title: "18 and Above",
        message: "Required documents for applicants aged 18 years and above may vary according to the applicable process. Please contact DASTAVEZ MITRA for the current document checklist."
      }
    },
    process: [
      "Contact DASTAVEZ MITRA on WhatsApp for minor/adult name change workflow.",
      "Draft name change affidavit and receive newspaper advertisement guidelines.",
      "Publish in required daily newspapers and compile the gazette application dossier.",
      "Submit application to the Government Printing Department and track publication."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I want information about Gazette Notification / Name Change.",
    notes: "Gazette notification is the official standard proof accepted across government departments, banks, and passport offices."
  },

  // ==========================================
  // 6. FALLBACK / ANY OTHER DOCUMENTS
  // ==========================================
  {
    id: "any-other-documents",
    slug: "any-other-documents",
    name: "Any Other Documents",
    category: "other",
    categoryName: "Other Services",
    icon: "layers",
    shortDescription: "Custom documentation support for any specific deed, declaration, certificate, or paperwork not listed above.",
    whoNeedsThis: "Anyone needing specialized documentation assistance, custom declarations, or tailored paperwork in Gurugram.",
    hasConfirmedDocs: false,
    isFallbackService: true,
    fallbackPromptHeading: "कोई अन्य Specific Document यहाँ Mention नहीं है?",
    fallbackPromptText: "आप हमें अपना matter/message भेज सकते हैं। WhatsApp या Call के माध्यम से हम आपकी सहायता के लिए उपलब्ध हैं।",
    documents: [],
    process: [
      "Send details of your specific document or legal paperwork requirement.",
      "Connect with our Gurugram desk via WhatsApp (9871592002) or Call (9540403071).",
      "Receive personalized checklist, drafting guidance, and procedure timeline.",
      "Proceed with prepared documentation and verification assistance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with a custom document / paperwork not listed on the website.",
    notes: "Call support available 9 AM – 7 PM (9540403071). Outside call hours, WhatsApp message support is available 24/7 (9871592002)."
  }
];

/**
 * Helper to generate a pre-filled WhatsApp link
 * STRICT RULE: Only connects to 9871592002
 */
export function getWhatsappLink(customMessage) {
  const message = customMessage || BRAND_INFO.defaultWhatsappMessage;
  return `${BRAND_INFO.whatsappUrlPrefix}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to generate a direct phone call link
 * STRICT RULE: Only connects to 9540403071
 */
export function getCallLink() {
  return `tel:+91${BRAND_INFO.callingNumber}`;
}

/**
 * Helper to find a service by slug or id (including legacy slug aliases)
 */
export function getServiceBySlug(slugOrId) {
  if (!slugOrId) return null;
  const normalized = slugOrId.toLowerCase().trim();
  
  // Direct match
  const directMatch = SERVICES.find(s => 
    s.slug.toLowerCase() === normalized || 
    s.id.toLowerCase() === normalized
  );
  if (directMatch) return directMatch;

  // Legacy alias matches
  if (normalized === 'driving-licence' || normalized === 'driving-licence-work') {
    return SERVICES.find(s => s.slug === 'learner-licence') || null;
  }
  if (normalized === 'noc-vehicle-work') {
    return SERVICES.find(s => s.slug === 'vehicle-noc-form-28') || null;
  }
  if (normalized === 'hp-cancellation') {
    return SERVICES.find(s => s.slug === 'hp-cancel') || null;
  }
  if (normalized === 'rta-work' || normalized === 'vehicle-documentation-rto') {
    return SERVICES.find(s => s.slug === 'rto') || null;
  }
  if (normalized === 'same-day-marriage' || normalized === 'same-day-marriage-assistance' || normalized === 'arya-samaj-marriage') {
    return SERVICES.find(s => s.slug === 'quick-marriage-assistance') || null;
  }
  if (normalized === 'gpa-power-of-attorney' || normalized === 'spa-power-of-attorney' || normalized === 'gpa' || normalized === 'spa') {
    return SERVICES.find(s => s.slug === 'gpa-spa') || null;
  }
  if (normalized === 'other-documentation-services') {
    return SERVICES.find(s => s.slug === 'any-other-documents') || null;
  }

  return null;
}
