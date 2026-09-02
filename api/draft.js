import { checkRateLimit, getClientIp, sanitizeInput } from './_auth.js';
import { getContactCtaFooter } from './_legal_knowledge.js';

/**
 * Generate preliminary Affidavit Draft based on structured questionnaire
 */
function buildAffidavitDraft(data) {
  const deponentName = data.deponentName || '[Deponent Full Name]';
  const fatherOrHusband = data.relativeName || '[Father / Husband Name]';
  const age = data.age || '[Age]';
  const address = data.address || '[Complete Residential Address, Gurugram]';
  const purpose = data.purpose || 'General Declaration';
  const submitTo = data.submittingAuthority || '[Concerned Authority / Department]';
  const aadhaar = data.idNumber ? `Aadhaar No. / ID: ${data.idNumber}` : '[Aadhaar Card / ID Proof]';
  const statements = Array.isArray(data.statements) && data.statements.length > 0 
    ? data.statements 
    : [data.customFacts || 'That the facts stated in the accompanying application are true and correct to the best of my knowledge.'];

  return `PRELIMINARY AFFIDAVIT DRAFT
(To be executed on appropriate Non-Judicial e-Stamp Paper with Notary Attestation)

BEFORE THE COMPETENT AUTHORITY / NOTARY PUBLIC, GURUGRAM

AFFIDAVIT OF: ${deponentName.toUpperCase()}
PURPOSE: ${purpose.toUpperCase()}
SUBMITTING TO: ${submitTo.toUpperCase()}

I, ${deponentName}, ${data.relationType || 'S/o / D/o / W/o'} Sh. ${fatherOrHusband}, aged about ${age} years, resident of ${address} (${aadhaar}), do hereby solemnly affirm and declare on oath as under:

1. That I am a permanent and bonafide resident of India residing at the above-mentioned address.

2. That this affidavit is being executed for the specific purpose of: ${purpose} to be submitted before ${submitTo}.

${statements.map((stmt, idx) => `${idx + 3}. That ${stmt}`).join('\n\n')}

${statements.length + 3}. That I have not concealed any material fact or information relevant to this matter from the concerned authority.

${statements.length + 4}. That the contents of this affidavit are true and correct to the best of my personal knowledge and belief, and nothing material has been concealed therefrom.

DEPONENT

VERIFICATION:
Verified at Gurugram on this _____ day of ____________, 2026, that the contents of above paragraphs are true and correct to my knowledge and belief and no part of it is false.

DEPONENT

--------------------------------------------------
⚠️ महत्वपूर्ण सूचना (IMPORTANT STATUTORY NOTICE):
1. "यह एक प्रारंभिक ड्राफ्ट है। अपने Affidavit को final करवाने के लिए DASTAVEZ MITRA से संपर्क करें। आवश्यक verification के बाद आपका Affidavit तैयार करके दिया जाएगा।"
2. "नोटरी के लिए आपकी व्यक्तिगत उपस्थिति अनिवार्य होगी।"
3. Contact for Verification & e-Stamp Printing:
   • 💬 WhatsApp: 9871592002
   • 📞 Call: 9540403071 (9 AM – 7 PM)`;
}

/**
 * Generate preliminary Agreement Draft based on structured inputs
 */
function buildAgreementDraft(data) {
  const agreementType = data.agreementType || 'General Agreement';
  const date = data.startDate || '_____ day of ____________, 2026';
  const place = data.place || 'Gurugram, Haryana';
  
  // Parties
  const parties = Array.isArray(data.parties) && data.parties.length > 0 ? data.parties : [
    { label: 'First Party', name: data.firstPartyName || '[First Party Full Name]', address: data.firstPartyAddress || '[First Party Address]', id: data.firstPartyId || '[ID/Aadhaar]' },
    { label: 'Second Party', name: data.secondPartyName || '[Second Party Full Name]', address: data.secondPartyAddress || '[Second Party Address]', id: data.secondPartyId || '[ID/Aadhaar]' }
  ];

  // Specific Clauses
  let commercialClauses = [];
  
  if (data.isVehicleRental || agreementType.toLowerCase().includes('vehicle rental') || agreementType.toLowerCase().includes('car rental')) {
    commercialClauses = [
      `VEHICLE PARTICULARS: Make & Model: ${data.vehicleModel || '[Vehicle Model]'}, Reg. No: ${data.vehicleRegNo || '[HR-26-XXXX]'}, Chassis No: ${data.chassisNo || '[Chassis No]'}, Engine No: ${data.engineNo || '[Engine No]'}.`,
      `RENTAL DURATION: Effective from ${data.startDate || '[Start Date]'} to ${data.endDate || '[End Date]'} (Total Duration: ${data.duration || '[Duration]'}).`,
      `CONSIDERATION & DEPOSIT: The Second Party agrees to pay Rent of Rs. ${data.rentAmount || '[Rent Amount]'} per month/period and has deposited a refundable security amount of Rs. ${data.securityDeposit || '[Security Deposit]'}.`,
      `USE & DRIVER: The vehicle shall be used strictly for ${data.permittedUse || 'lawful personal/commercial transportation'} and driven only by authorized licensed driver(s).`,
      `MAINTENANCE & FUEL: Fuel expenses shall be borne by ${data.fuelResponsibility || 'Second Party'}. Routine maintenance by ${data.maintenanceResponsibility || 'First Party'}.`,
      `CHALLANS & TRAFFIC FINES: Any traffic camera challan, over-speeding fine, or penalty incurred during the rental tenure shall be the sole responsibility of the Second Party.`,
      `ACCIDENT / DAMAGE & INSURANCE: In case of accident or damage, the Second Party shall immediately inform the First Party and police authority. Liability beyond insurance claim settlement shall be borne as per mutually agreed terms.`,
      `TERMINATION & RETURN: The agreement may be terminated by either party with ${data.noticePeriod || '15 days'} prior written notice. The vehicle must be returned in original running condition.`
    ];
  } else if (data.isRentAgreement || agreementType.toLowerCase().includes('rent') || agreementType.toLowerCase().includes('lease')) {
    commercialClauses = [
      `PROPERTY DETAILS: Premises situated at ${data.propertyAddress || '[Complete Rental Property Address, Gurugram]'}.`,
      `TENANCY PERIOD: Fixed for a period of ${data.duration || '11 months'} commencing from ${data.startDate || '[Start Date]'}.`,
      `MONTHLY RENT: Rs. ${data.rentAmount || '[Rent Amount]'} payable on or before the ${data.rentDueDay || '7th'} day of each calendar month.`,
      `SECURITY DEPOSIT: Rs. ${data.securityDeposit || '[Security Deposit]'} interest-free refundable deposit paid by the Tenant to the Landlord.`,
      `ELECTRICITY & WATER: Bills to be paid directly by the Tenant as per meter readings.`,
      `NOTICE & TERMINATION: Either party may terminate the tenancy by giving ${data.noticePeriod || '1 month'} advance written notice.`,
      `PERMITTED USE: Premises shall be used exclusively for ${data.permittedUse || 'residential'} purposes and no unlawful activity shall be conducted.`
    ];
  } else {
    commercialClauses = Array.isArray(data.customClauses) && data.customClauses.length > 0 ? data.customClauses : [
      `PURPOSE & SCOPE: The parties agree to enter into this agreement for the purpose of ${data.purpose || agreementType}.`,
      `CONSIDERATION: As mutually agreed, consideration / payment terms shall be Rs. ${data.consideration || '[Amount]'} as per agreed milestones.`,
      `OBLIGATIONS OF FIRST PARTY: ${data.firstPartyObligations || 'To perform designated duties, provide access, and supply necessary documentation.'}`,
      `OBLIGATIONS OF SECOND PARTY: ${data.secondPartyObligations || 'To fulfill contractual milestones, maintain compliance, and make timely payments.'}`,
      `DEFAULT & BREACH: In the event of default or breach, the aggrieved party shall serve a 15-day rectification notice.`,
      `TERMINATION & NOTICE: The agreement can be terminated with ${data.noticePeriod || '30 days'} written notice by either party.`,
      `DISPUTE RESOLUTION: Any dispute arising under this agreement shall be subject to the exclusive jurisdiction of the competent courts in Gurugram, Haryana.`
    ];
  }

  return `PRELIMINARY AGREEMENT DRAFT
(To be executed on appropriate Non-Judicial Stamp Paper with Witness Verification)

${agreementType.toUpperCase()}

This ${agreementType} is entered into on this ${date} at ${place} BY AND BETWEEN:

${parties.map((p, idx) => `
${idx + 1}. ${p.label.toUpperCase()}:
${p.name}, residing at / having office at ${p.address} (${p.id || 'Aadhaar / ID Proof'}) (hereinafter referred to as the "${p.label}", which expression shall include their legal heirs, successors, and assigns).
`).join('\n')}

WHEREAS the parties have mutually agreed to the terms and conditions set forth herein:

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

${commercialClauses.map((clause, idx) => `${idx + 1}. ${clause}`).join('\n\n')}

IN WITNESS WHEREOF, the parties hereto have signed and executed this agreement on the day, month, and year first above written in the presence of witnesses.

${parties.map(p => `______________________\n(${p.label}: ${p.name})`).join('\n\n')}

WITNESSES:
1. Name & Address: ___________________________ (Sign: ___________)
2. Name & Address: ___________________________ (Sign: ___________)

--------------------------------------------------
⚠️ IMPORTANT DISCLAIMER:
"This is a preliminary document draft based on the information provided. Final verification, drafting and execution should be done after reviewing the applicable requirements."
Contact for Verification, Stamping & Final Execution:
• 💬 WhatsApp: 9871592002
• 📞 Call: 9540403071 (9 AM – 7 PM)`;
}

/**
 * Generate preliminary Will / Testament Draft based on structured 5-step interview
 */
function buildWillDraft(data) {
  const testatorName = data.testatorName || '[Testator Full Name]';
  const relativeName = data.relativeName || '[Father / Husband Name]';
  const age = data.age || '[Age]';
  const address = data.address || '[Residential Address, Gurugram]';
  const aadhaar = data.aadhaar ? `Aadhaar No. ${data.aadhaar}` : '[Aadhaar Number]';
  const executorName = data.executorName || '[Executor Name / Sole Beneficiary]';

  const immovableAssets = Array.isArray(data.immovableAssets) ? data.immovableAssets : [];
  const movableAssets = Array.isArray(data.movableAssets) ? data.movableAssets : [];

  return `PRELIMINARY WILL / TESTAMENT DRAFT
(Drafted for Legal Verification and Optional Registration at Sub-Registrar Office)

LAST WILL AND TESTAMENT OF ${testatorName.toUpperCase()}

I, ${testatorName}, ${data.relationType || 'S/o / D/o / W/o'} Sh. ${relativeName}, aged about ${age} years, resident of ${address}, holding ${aadhaar}, of sound state of mind, memory and understanding, and without any coercion, undue influence, or fraud, do hereby make, publish and declare this as my LAST WILL AND TESTAMENT, hereby revoking all former Wills and Codicils made by me at any time heretofore.

1. APPOINTMENT OF EXECUTOR:
I hereby appoint ${executorName} as the sole Executor of this my Will to administer and execute my estate in accordance with my expressed wishes.

2. DECLARATION OF SOUND HEALTH & CAPACITY:
I declare that I am in full possession of my mental faculties and understand the nature and effect of this disposition of my assets.

3. SCHEDULE OF IMMOVABLE PROPERTIES & DISPOSITION:
${immovableAssets.length > 0 ? immovableAssets.map((prop, idx) => `
3.${idx + 1}. Property: ${prop.propertyType || 'Immovable Property'} situated at ${prop.address || '[Address]'} (Ownership / Share: ${prop.share || '100%'}).
   • Intended Beneficiary: ${prop.beneficiaryName || '[Beneficiary Name]'} (${prop.relation || 'Relation'}).
   • Allocated Share / Interest: ${prop.beneficiaryShare || '100% absolute ownership'}.
   ${prop.conditions ? `• Specific Condition / Life Interest: ${prop.conditions}` : '• Nature: Absolute and unfettered ownership upon my demise.'}
   ${prop.alternateBeneficiary ? `• Alternate Beneficiary (in case of prior demise of primary beneficiary): ${prop.alternateBeneficiary}` : ''}
`).join('\n') : `
I bequeath all my immovable properties, residential plots, flats, commercial units, and landed assets of every description belonging to me at the time of my death unto my designated beneficiary(ies) absolutely.
`}

4. SCHEDULE OF MOVABLE ASSETS, INVESTMENTS & FINANCIAL ACCOUNTS:
${movableAssets.length > 0 ? movableAssets.map((asset, idx) => `
4.${idx + 1}. Asset: ${asset.assetType || 'Movable Asset'} (${asset.details || 'Account / Investment Details'}).
   • Intended Beneficiary: ${asset.beneficiaryName || '[Beneficiary Name]'} (${asset.relation || 'Relation'}).
   • Allocated Share: ${asset.share || '100%'}.
   ${asset.specialNotes ? `• Special Instructions: ${asset.specialNotes}` : ''}
`).join('\n') : `
I bequeath all my movable assets including bank accounts, fixed deposits, bank lockers, jewellery, motor vehicles, shares, mutual funds, insurance policies, and investments belonging to me at the time of my death unto my designated beneficiary(ies).
`}

5. RESIDUARY CLAUSE:
Any other property, asset, claim, or sum of money belonging to me at the time of my death not specifically mentioned herein shall devolve upon ${data.residuaryBeneficiary || executorName} absolutely.

6. SPECIAL SUCCESSION & RESTRICTIONS NOTICE:
Any life interest or intended restrictions concerning subsequent transfers have been recorded as expressed by the Testator. The legal enforceability of specific conditions remains subject to statutory provisions under the Indian Succession Act, 1925 and Transfer of Property Act, 1882.

IN WITNESS WHEREOF, I, the Testator above-named, have set my hand to this my Last Will and Testament on this _____ day of ____________, 2026 at Gurugram, Haryana.

__________________________
TESTATOR (${testatorName})

SIGNED by the Testator in our presence, who in their presence and at their request, and in the presence of each other, have subscribed our names as witnesses:

WITNESS 1:
Name: ___________________________
S/o, W/o: ________________________
Address: _________________________
Aadhaar No: ______________________
Signature: _______________________

WITNESS 2:
Name: ___________________________
S/o, W/o: ________________________
Address: _________________________
Aadhaar No: ______________________
Signature: _______________________

--------------------------------------------------
⚠️ IMPORTANT DISCLAIMER:
"This is a preliminary draft based on the information provided. Final Will drafting and execution should be done after appropriate legal/document verification."
Contact for Verification, Doctor's Certificate Guidance & Sub-Registrar Registration:
• 💬 WhatsApp: 9871592002
• 📞 Call: 9540403071 (9 AM – 7 PM)`;
}

/**
 * Generate preliminary GPA / SPA Draft
 */
function buildGpaSpaDraft(data) {
  const docType = (data.docType || 'GPA').toUpperCase(); // GPA or SPA
  const isSpa = docType === 'SPA';
  const principalName = data.principalName || '[Principal / Executant Full Name]';
  const principalRelative = data.principalRelative || '[Father / Husband Name]';
  const principalAddress = data.principalAddress || '[Principal Residential Address]';
  const principalAadhaar = data.principalAadhaar ? `Aadhaar No. ${data.principalAadhaar}` : '[Principal Aadhaar]';

  const attorneyName = data.attorneyName || '[Attorney / Representative Full Name]';
  const attorneyRelative = data.attorneyRelative || '[Father / Husband Name]';
  const attorneyAddress = data.attorneyAddress || '[Attorney Residential Address]';
  const attorneyAadhaar = data.attorneyAadhaar ? `Aadhaar No. ${data.attorneyAadhaar}` : '[Attorney Aadhaar]';

  const purpose = data.purpose || 'Management and representation for legal/administrative affairs';
  const matterOrProperty = data.propertyDetails || data.matterDetails || '[Details of Property / Vehicle / Authority / Case]';
  const powers = Array.isArray(data.powers) && data.powers.length > 0 
    ? data.powers 
    : [
        'To appear, represent and sign applications before government, municipal, and revenue authorities.',
        'To submit documents, pay fees, obtain receipts, and receive official communications.',
        'To engage advocates, sign plaints, affidavits, declarations, and procedural papers.',
        isSpa 
          ? 'To perform the specific authorized acts limited strictly to the matter described herein.' 
          : 'To manage, supervise, and handle administrative and legal matters relating to the designated subject.'
      ];

  return `PRELIMINARY ${docType} DRAFT
(${docType === 'GPA' ? 'GENERAL POWER OF ATTORNEY' : 'SPECIAL POWER OF ATTORNEY'})
(To be executed on appropriate Stamp Paper with Notary Attestation / Registration as applicable)

KNOW ALL MEN BY THESE PRESENTS that I, ${principalName}, ${data.principalRelationType || 'S/o / D/o / W/o'} Sh. ${principalRelative}, resident of ${principalAddress} (${principalAadhaar}), (hereinafter called the "PRINCIPAL / EXECUTANT"),

DO HEREBY NOMINATE, CONSTITUTE AND APPOINT:

${attorneyName}, ${data.attorneyRelationType || 'S/o / D/o / W/o'} Sh. ${attorneyRelative}, resident of ${attorneyAddress} (${attorneyAadhaar}), (hereinafter called the "ATTORNEY"),

as my true and lawful Attorney in my name and on my behalf to perform all or any of the following acts, deeds, and things regarding:
SUBJECT MATTER: ${matterOrProperty}
PURPOSE: ${purpose}

POWERS CONFERRED:
${powers.map((p, idx) => `${idx + 1}. ${p}`).join('\n\n')}

${isSpa ? `
LIMITATION OF AUTHORITY:
This Special Power of Attorney is restricted exclusively to the specific transaction and matter described above and shall automatically stand revoked/terminated upon the completion of the said transaction.
` : `
RATIFICATION CLAUSE:
I hereby agree and undertake to ratify and confirm all and whatsoever acts, deeds, and things my said Attorney shall lawfully do or cause to be done by virtue of these presents.
`}

IN WITNESS WHEREOF, I have executed this ${docType} on this _____ day of ____________, 2026 at Gurugram, Haryana.

__________________________
PRINCIPAL / EXECUTANT (${principalName})

I ACCEPT THE POWERS CONFERRED HEREIN:
__________________________
ATTORNEY HOLDER (${attorneyName})

WITNESSES:
1. Name & Aadhaar: ___________________________ (Sign: ___________)
2. Name & Aadhaar: ___________________________ (Sign: ___________)

--------------------------------------------------
⚠️ IMPORTANT NOTARY & REGISTRATION NOTICE:
1. "Notary GPA/SPA can be provided."
2. "Notary के लिए आपकी व्यक्तिगत उपस्थिति आवश्यक होगी।"
3. Registration Notice:
   "If GPA/SPA registration is available/open in the applicable Tehsil/authority, DASTAVEZ MITRA can assist with registration. If registration is not available/open there, notary execution can be assisted with, subject to applicable requirements. Final registration remains subject to the competent Sub-Registrar authority."
4. Required Basic Documents: Aadhaar Card of both relevant parties.
Contact for Verification & Execution:
• 💬 WhatsApp: 9871592002
• 📞 Call: 9540403071 (9 AM – 7 PM)`;
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);
  const isAllowed = checkRateLimit(`draft_${clientIp}`, 15, 5 * 60 * 1000);
  if (!isAllowed) {
    return res.status(429).json({
      success: false,
      error: 'You have submitted several draft requests. Please wait a moment or reach out directly via WhatsApp.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const draftType = (body.draftType || '').toLowerCase().trim();
    const data = body.data || body;

    let draftText = '';

    if (draftType === 'affidavit') {
      draftText = buildAffidavitDraft(data);
    } else if (draftType === 'agreement') {
      draftText = buildAgreementDraft(data);
    } else if (draftType === 'will') {
      draftText = buildWillDraft(data);
    } else if (draftType === 'gpa-spa' || draftType === 'gpa' || draftType === 'spa') {
      draftText = buildGpaSpaDraft(data);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid draft type specified. Supported types: affidavit, agreement, will, gpa-spa.'
      });
    }

    return res.status(200).json({
      success: true,
      draftType,
      draft: draftText,
      disclaimer: "This is a preliminary document draft based on the information provided. Final verification, drafting and execution should be done after reviewing the applicable requirements.",
      cta: getContactCtaFooter()
    });

  } catch (err) {
    console.error('Drafting API Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to generate draft at the moment. Please contact DASTAVEZ MITRA on WhatsApp at 9871592002.'
    });
  }
}
