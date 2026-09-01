/**
 * DASTAVEZ MITRA - Centralized Services Data Store
 * All services configured with editable fields.
 * To add, modify, or remove services, update this data array.
 */

export const BRAND_INFO = {
  name: "DASTAVEZ MITRA",
  tagline: "Documentation & Assistance Services",
  headline: "Documentation Ka Kaam? DASTAVEZ MITRA Se Sampark Kijiye.",
  subheading: "RTO, Vehicle Documentation, Marriage Registration, Affidavit, Agreement aur anya documentation services ke liye assistance.",
  contactNumbersDisplay: "9871592002 | 9540403071",
  whatsappNumber: "9871592002",
  secondContactNumber: "9540403071",
  whatsappDisplayNumber: "9871592002 | 9540403071",
  whatsappUrlPrefix: "https://wa.me/919871592002",
  serviceLocationNotice: "Services currently available in Gurugram only.",
  instagramHandle: "@dastavezmitra",
  instagramUrl: "https://instagram.com/dastavezmitra",
  facebookName: "DASTAVEZ MITRA",
  facebookUrl: "https://facebook.com",
  defaultWhatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with a documentation service.",
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
  {
    id: "rc-transfer",
    slug: "rc-transfer",
    name: "RC Transfer",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "car",
    shortDescription: "Complete assistance for transferring vehicle registration certificate ownership between parties.",
    whoNeedsThis: "Individuals buying or selling pre-owned cars, two-wheelers, commercial vehicles, or transferring vehicle ownership within family.",
    documents: [],
    process: [
      "Select RC Transfer & connect with DASTAVEZ MITRA on WhatsApp.",
      "Receive guidance on the required forms and vehicle verification documents.",
      "Prepare and compile the application file with guidance.",
      "Submit and track transfer progress."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need help with RC Transfer.",
    notes: "Requirements and procedures may vary based on whether the vehicle is within the same RTO jurisdiction or inter-state."
  },
  {
    id: "vehicle-documentation-rto",
    slug: "rto-work",
    name: "Vehicle Documentation / RTO Work",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "shield-check",
    shortDescription: "End-to-end documentation assistance for all general RTO and vehicle-related paperwork.",
    whoNeedsThis: "Vehicle owners needing help navigating various RTO documentation procedures, fitness renewal, or updates.",
    documents: [],
    process: [
      "Reach out on WhatsApp specifying your vehicle documentation requirement.",
      "Get clear instructions on the specific forms and paperwork needed.",
      "Review your document readiness before final submission.",
      "Follow guided steps to complete your RTO task smoothly."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Vehicle Documentation / RTO Work.",
    notes: "Guidelines vary depending on vehicle type (private or commercial) and local RTO regulations."
  },
  {
    id: "rta-work",
    slug: "rta-work",
    name: "RTA Work",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "truck",
    shortDescription: "Assistance with regional transport authority filings, permits, endorsements, and renewals.",
    whoNeedsThis: "Commercial vehicle owners, transport operators, and individuals with RTA specific filings.",
    documents: [],
    process: [
      "Contact us via WhatsApp with your RTA requirements.",
      "Receive checklist of required documentation for your specific RTA authority.",
      "Draft and organize application papers correctly.",
      "Proceed with authorized submission steps."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with RTA Work.",
    notes: "RTA rules and requirements are determined by state transport departments."
  },
  {
    id: "traffic-challan-assistance",
    slug: "traffic-challan",
    name: "Traffic Challan Assistance",
    category: "vehicle-rto",
    categoryName: "Vehicle & RTO",
    icon: "alert-circle",
    shortDescription: "Guidance on checking pending e-challans, virtual court challans, and resolution assistance.",
    whoNeedsThis: "Vehicle owners who have received camera/e-challans or notice challans and need help understanding resolution procedures.",
    documents: [],
    process: [
      "Share your vehicle details / challan number via WhatsApp.",
      "We help verify challan status and appropriate resolution channel.",
      "Receive guidance on online portal settlement or virtual court procedures.",
      "Obtain payment confirmation / closure guidance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance regarding a Traffic Challan.",
    notes: "Challan disposal timelines and options depend on the issuing traffic police wing and court portal."
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
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Vehicle NOC – Form 28.",
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
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with International Driving Licence.",
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
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Learner Licence.",
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
    documents: [
      "Form 26",
      "FIR Copy",
      "Insurance Copy",
      "Pollution Certificate Copy",
      "Address Proof",
      "NCRB"
    ],
    process: [
      "Contact DASTAVEZ MITRA on WhatsApp with your vehicle details.",
      "Prepare Form 26 and arrange FIR / NCRB clearance report.",
      "Compile vehicle insurance, pollution certificate, and address proof.",
      "Guidance on RTO application submission for duplicate RC issuance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance for Duplicate RC.",
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
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with HP Cancel.",
    notes: "Bank NOC letter is valid for a limited period; ensure timely submission along with Form 35 (2 copies)."
  },
  {
    id: "marriage-registration",
    slug: "marriage-registration",
    name: "Marriage Registration",
    category: "marriage",
    categoryName: "Marriage Documentation",
    icon: "heart",
    shortDescription: "Documentation and appointment assistance for legal marriage registration certificate.",
    whoNeedsThis: "Newly married couples or couples needing a formal marriage registration certificate for passport, visa, or official records.",
    documents: [],
    process: [
      "Connect on WhatsApp to check applicable marriage acts and requirements.",
      "Gather and organize identity proofs, address proofs, and witness documents.",
      "Complete application form drafting and appointment scheduling guidance.",
      "Attend the verification appointment with complete paperwork."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Marriage Registration.",
    notes: "Marriage registration requirements depend on jurisdiction and the governing act (Hindu Marriage Act, Special Marriage Act, etc.)."
  },
  {
    id: "same-day-marriage-assistance",
    slug: "same-day-marriage",
    name: "Same Day Marriage Assistance",
    category: "marriage",
    categoryName: "Marriage Documentation",
    icon: "zap",
    shortDescription: "Step-by-step documentation guidance for urgent marriage registration and certification.",
    whoNeedsThis: "Couples needing fast-track documentation for urgent travel, visa deadlines, or official verification.",
    documents: [],
    process: [
      "WhatsApp DASTAVEZ MITRA with your urgent requirements.",
      "Receive immediate guidance on necessary affidavits and identity documents.",
      "Verify document completeness prior to appointment slot booking.",
      "Follow expedited documentation workflow."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance for Same Day Marriage documentation.",
    notes: "Scheduling and availability depend on the registrar office slots and complete document readiness."
  },
  {
    id: "arya-samaj-marriage",
    slug: "arya-samaj-marriage",
    name: "Arya Samaj Marriage",
    category: "marriage",
    categoryName: "Marriage Documentation",
    icon: "sun",
    shortDescription: "Documentation support for solemnizing and recording Arya Samaj wedding rites followed by registration.",
    whoNeedsThis: "Couples looking for guidance on documentation requirements for Arya Samaj wedding rituals and subsequent government registration.",
    documents: [],
    process: [
      "Connect via WhatsApp for age, identity, and ritual document checklist.",
      "Verify all required affidavits, witness identity documents, and photos.",
      "Guidance on mandir rites documentation and issuance of marriage certificate.",
      "Guidance on subsequent SDM/Registrar legal registration."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance for Arya Samaj Marriage documentation.",
    notes: "Both parties must fulfill age and identity criteria according to applicable norms."
  },
  {
    id: "live-in-relationship-agreement",
    slug: "live-in-agreement",
    name: "Live-In Relationship Agreement",
    category: "affidavit-agreements",
    categoryName: "Affidavits & Agreements",
    icon: "users",
    shortDescription: "Drafting mutual cohabitation and live-in relationship agreements detailing mutual terms.",
    whoNeedsThis: "Couples living together seeking a clear written mutual declaration and understanding of terms and responsibilities.",
    documents: [],
    process: [
      "Reach out on WhatsApp with your key preferences and terms.",
      "Receive draft agreement structured with customized mutual clauses.",
      "Review the draft and finalize terms.",
      "Execute the agreement on appropriate stamp paper with notarization guidance."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Live-In Relationship Agreement drafting.",
    notes: "Agreements are drafted based on mutual consent of both consenting adults."
  },
  {
    id: "affidavit",
    slug: "affidavit",
    name: "Affidavit",
    category: "affidavit-agreements",
    categoryName: "Affidavits & Agreements",
    icon: "file-text",
    shortDescription: "Preparation and drafting of all types of general, name discrepancy, address, and declaration affidavits.",
    whoNeedsThis: "Anyone needing an official sworn statement or declaration for passport, college admission, duplicate docs, or bank purposes.",
    documents: [],
    process: [
      "Send details of the affidavit purpose and specific requirement on WhatsApp.",
      "We prepare a precise draft tailored to the receiving authority's specifications.",
      "Guidance on appropriate denomination stamp paper.",
      "Assistance with attestation and completion."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need help with an Affidavit.",
    notes: "Stamp duty values vary by state and affidavit purpose."
  },
  {
    id: "agreement-drafting",
    slug: "agreement",
    name: "Agreement Drafting",
    category: "affidavit-agreements",
    categoryName: "Affidavits & Agreements",
    icon: "clipboard",
    shortDescription: "Custom drafting for rent agreements, service contracts, sale agreements, and general commercial agreements.",
    whoNeedsThis: "Landlords, tenants, freelancers, vendors, and individuals needing structured agreements with clearly stated clauses.",
    documents: [],
    process: [
      "Share your contract details and specific requirements on WhatsApp.",
      "Get a customized, clearly drafted agreement template.",
      "Review and suggest revisions to suit both parties.",
      "Guidance on execution, stamp duty, and witness verification."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need help with an Agreement.",
    notes: "Stamp duty and registration requirements vary depending on agreement tenure and asset value."
  },
  {
    id: "gazette-name-change",
    slug: "gazette-name-change",
    name: "Gazette / Name Change",
    category: "identity-certificates",
    categoryName: "Certificates & Gazette",
    icon: "book-open",
    shortDescription: "Step-by-step documentation guidance for official name change publication in the Central or State Gazette.",
    whoNeedsThis: "Persons wishing to change their name, correct spelling discrepancies, or update name after marriage/divorce.",
    documents: [],
    process: [
      "Contact DASTAVEZ MITRA on WhatsApp for the name change workflow.",
      "Draft name change affidavit and receive newspaper advertisement guidelines.",
      "Publish in required daily newspapers and compile the gazette application dossier.",
      "Submit application to the Government Printing Department and track publication."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Gazette / Name Change.",
    notes: "Gazette notification is the official standard proof accepted across government departments, banks, and passport offices."
  },
  {
    id: "will-testament-documentation",
    slug: "will-testament-documentation",
    name: "Will / Testament Documentation",
    category: "power-of-attorney",
    categoryName: "Power of Attorney & Wills",
    icon: "feather",
    shortDescription: "Assistance in drafting clear testamentary documents and wills for estate and asset succession.",
    whoNeedsThis: "Individuals wanting to clearly document their wishes regarding asset distribution and estate succession among heirs.",
    documents: [],
    process: [
      "Discuss your asset allocation overview on WhatsApp.",
      "Draft a comprehensive, clear will with detailed asset schedules.",
      "Review clauses for executor designation and witness requirements.",
      "Guidance on execution, registration (if desired), and safekeeping."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Will / Testament Documentation.",
    notes: "Registration of a will is optional but provides an added layer of authenticity."
  },
  {
    id: "legal-heir-certificate",
    slug: "legal-heir-certificate",
    name: "Legal Heir Certificate",
    category: "identity-certificates",
    categoryName: "Certificates & Gazette",
    icon: "user-check",
    shortDescription: "Documentation support for claiming legal heirship / survivor certificate for asset transfers and claims.",
    whoNeedsThis: "Surviving family members needing official documentation to claim deceased person's bank balances, PF, insurance, or property.",
    documents: [],
    process: [
      "Connect via WhatsApp with details of the deceased and surviving family members.",
      "Receive checklist for death certificate, family tree, and no-objection declarations.",
      "Prepare application form and accompanying affidavits.",
      "Follow submission guidelines at the local Revenue / Tehsildar office."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with Legal Heir Certificate documentation.",
    notes: "Procedures may differ between rural (Panchayat/Tehsil) and urban (SDM/Revenue) administrative bodies."
  },
  {
    id: "gpa-power-of-attorney",
    slug: "gpa-power-of-attorney",
    name: "GPA / General Power of Attorney",
    category: "power-of-attorney",
    categoryName: "Power of Attorney & Wills",
    icon: "award",
    shortDescription: "Drafting General Power of Attorney documents authorizing trusted persons to handle broad affairs.",
    whoNeedsThis: "NRIs, elderly persons, or busy individuals granting broad authorization to a family member or representative.",
    documents: [],
    process: [
      "Specify scope of powers and details of principal and attorney on WhatsApp.",
      "Receive a structured GPA draft clearly delineating authorized actions.",
      "Review and verify all party details and identity proofs.",
      "Guidance on execution, stamp duty payment, and sub-registrar registration."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with GPA (General Power of Attorney).",
    notes: "GPA involving immovable property generally mandates compulsory registration under state stamp laws."
  },
  {
    id: "spa-power-of-attorney",
    slug: "spa-power-of-attorney",
    name: "SPA / Special Power of Attorney",
    category: "power-of-attorney",
    categoryName: "Power of Attorney & Wills",
    icon: "target",
    shortDescription: "Drafting specific, purpose-limited Power of Attorney documents for defined transactions or tasks.",
    whoNeedsThis: "Persons needing to authorize someone for a specific single task such as property registration, bank matter, or vehicle sale.",
    documents: [],
    process: [
      "Define the specific purpose and transaction on WhatsApp.",
      "We prepare a tightly scoped SPA document avoiding ambiguities.",
      "Final review of specific power clauses.",
      "Guidance on stamping, notarization, or registration as needed."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with SPA (Special Power of Attorney).",
    notes: "An SPA is automatically restricted to the specific task mentioned and terminates upon its completion."
  },
  {
    id: "other-documentation-services",
    slug: "other-documentation-services",
    name: "Other Documentation Services",
    category: "other",
    categoryName: "Other Services",
    icon: "layers",
    shortDescription: "Assistance with custom paperwork, miscellaneous certificates, declarations, and general documentation needs.",
    whoNeedsThis: "Anyone with custom documentation needs not explicitly listed in the standard categories.",
    documents: [],
    process: [
      "Describe your specific documentation requirement on WhatsApp.",
      "We review the requirements and outline the standard document checklist.",
      "Receive step-by-step assistance tailored to your unique case.",
      "Proceed with prepared and verified documentation."
    ],
    estimatedTime: "",
    whatsappMessage: "Hello DASTAVEZ MITRA, I need assistance with a custom documentation service.",
    notes: "Tell us what paperwork or certificate you need assistance with, and we will guide you."
  }
];

/**
 * Helper to generate a pre-filled WhatsApp link
 * @param {string} customMessage - Optional custom message
 * @returns {string} - WhatsApp URL
 */
export function getWhatsappLink(customMessage) {
  const message = customMessage || BRAND_INFO.defaultWhatsappMessage;
  return `${BRAND_INFO.whatsappUrlPrefix}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to find a service by slug or id (including legacy slug aliases)
 * @param {string} slugOrId
 * @returns {object|null}
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

  return null;
}
