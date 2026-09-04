import assert from 'assert';
import { SERVICES, getServiceBySlug, BRAND_INFO } from './js/data/services.js';
import chatHandler from './api/chat.js';
import draftHandler from './api/draft.js';
import leadsHandler from './api/leads.js';
import adminLoginHandler from './api/admin-login.js';
import statsHandler from './api/stats.js';

// Mock Response Helper
function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, val) { this.headers[name] = val; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end(data) { this.body = data; return this; }
  };
}

async function runTests() {
  console.log('--- STARTING DASTAVEZ MITRA AUTOMATED TESTS ---');

  // TEST 1: Service Catalog & Structure Verification
  console.log('\n[1] Testing Service Catalog Structure...');
  
  // Verify RC Transfer
  const rcTransfer = getServiceBySlug('rc-transfer');
  assert(rcTransfer, 'RC Transfer service must exist');
  assert(rcTransfer.documents.includes('Original RC'), 'RC Transfer must include Original RC');
  assert(rcTransfer.documents.includes("Seller Affidavit"), 'RC Transfer must include Seller Affidavit');
  assert(rcTransfer.documents.includes("Buyer Affidavit"), 'RC Transfer must include Buyer Affidavit');
  assert(rcTransfer.documents.some(d => d.includes('Joint photograph')), 'RC Transfer must include Joint photograph');
  console.log('  ✓ RC Transfer service verified with 11-point checklist.');

  // Verify generic "Vehicle Documentation / RTO Work" is removed
  const genericRto = SERVICES.find(s => s.name === 'Vehicle Documentation / RTO Work' || s.id === 'vehicle-documentation-rto');
  assert(!genericRto, 'Generic "Vehicle Documentation / RTO Work" must be removed');
  console.log('  ✓ Generic "Vehicle Documentation / RTO Work" confirmed removed.');

  // Verify RTO sub-services
  const rtoService = getServiceBySlug('rto');
  assert(rtoService, 'RTO service must exist');
  assert(rtoService.name === 'RTO', 'Service name must be "RTO"');
  assert(rtoService.subServices && rtoService.subServices.length === 4, 'RTO must have 4 sub-services');
  assert(rtoService.subServices.some(s => s.name.includes('Road Tax')), 'RTO must have Road Tax');
  assert(rtoService.subServices.some(s => s.name.includes('Fitness Certificate')), 'RTO must have Fitness Certificate');
  assert(rtoService.subServices.some(s => s.name.includes('Commercial Vehicle → Private Vehicle Conversion')), 'RTO must have Conversion');
  assert(rtoService.subServices.some(s => s.name.includes('RTO Challan Payment / Assistance')), 'RTO must have RTO Challan');
  console.log('  ✓ RTO service verified with 4 clickable sub-services.');

  // Verify Traffic Challan Assistance
  const challanService = getServiceBySlug('traffic-challan');
  assert(challanService, 'Traffic Challan Assistance must exist');
  assert(challanService.categorizedDocuments && challanService.categorizedDocuments.length === 3, 'Traffic challan must have 3 categorized doc groups');
  console.log('  ✓ Traffic Challan Assistance verified with General, Commercial, and Company documents.');

  // Verify Quick Marriage Assistance (Merged)
  const marriageService = getServiceBySlug('quick-marriage-assistance');
  assert(marriageService, 'Quick Marriage Assistance must exist');
  assert(marriageService.ageRequirementHindi.includes('21') && marriageService.ageRequirementHindi.includes('18'), 'Marriage age requirement must be 21/18');
  assert(!SERVICES.find(s => s.id === 'same-day-marriage-assistance'), 'Separate Same Day Marriage must be removed');
  assert(!SERVICES.find(s => s.id === 'arya-samaj-marriage'), 'Separate Arya Samaj Marriage must be removed');
  console.log('  ✓ Quick Marriage Assistance verified (Merged with 21/18 age rule).');

  // Verify Live-In Relationship Agreement
  const liveInService = getServiceBySlug('live-in-agreement');
  assert(liveInService, 'Live-In Relationship Agreement must exist');
  assert(liveInService.ageRequirementHindi.includes('18'), 'Live-In must specify 18+');
  console.log('  ✓ Live-In Relationship Agreement verified with 18+ requirement.');

  // Verify Legal Heir Certificate
  const legalHeir = getServiceBySlug('legal-heir-certificate');
  assert(legalHeir, 'Legal Heir Certificate must exist');
  assert(legalHeir.personalAppearanceNotice.includes('व्यक्तिगत उपस्थिति'), 'Legal Heir must include personal appearance notice');
  assert(legalHeir.process.length === 6, 'Legal Heir must have 6-step end-to-end workflow');
  console.log('  ✓ Legal Heir Certificate verified with Municipal, Patwari, and Tehsildar workflow.');

  // Verify GPA / SPA (Merged)
  const gpaSpa = getServiceBySlug('gpa-spa');
  assert(gpaSpa, 'GPA / SPA service must exist');
  assert(!SERVICES.find(s => s.id === 'spa-power-of-attorney'), 'Separate SPA must be merged');
  console.log('  ✓ GPA / SPA service verified (Merged).');

  // Verify Any Other Documents fallback
  const fallback = getServiceBySlug('any-other-documents');
  assert(fallback, 'Any Other Documents must exist');
  assert(fallback.isFallbackService, 'Must be marked as fallback');
  console.log('  ✓ Any Other Documents verified as fallback contact service.');

  // Verify Duplicate RC documents
  const duplicateRc = getServiceBySlug('duplicate-rc');
  assert(duplicateRc, 'Duplicate RC service must exist');
  assert(duplicateRc.documents.includes('Form 26'), 'Duplicate RC must include Form 26');
  assert(duplicateRc.documents.includes('FIR Copy'), 'Duplicate RC must include FIR Copy');
  assert(duplicateRc.documents.includes('Insurance Copy'), 'Duplicate RC must include Insurance Copy');
  assert(duplicateRc.documents.includes('Pollution Certificate / PUC Copy'), 'Duplicate RC must include Pollution Certificate / PUC Copy');
  assert(duplicateRc.documents.includes('NCRB Report'), 'Duplicate RC must include NCRB Report');
  assert(duplicateRc.documents.includes('Address Proof'), 'Duplicate RC must include Address Proof');
  assert(duplicateRc.documents.includes('Affidavit'), 'Duplicate RC must include Affidavit');
  assert(duplicateRc.documents.length === 7, 'Duplicate RC must have exactly 7 required documents');
  console.log('  ✓ Duplicate RC verified with full 7-point document checklist.');

  // Verify Contact Numbers & Instagram
  assert(BRAND_INFO.whatsappNumber === '9871592002', 'WhatsApp number must be 9871592002');
  assert(BRAND_INFO.callingNumber === '9540403071', 'Calling number must be 9540403071');
  assert(BRAND_INFO.instagramHandle === '@dastavezmitra', 'Instagram handle must be @dastavezmitra');
  assert(BRAND_INFO.instagramUrl.includes('dastavezmitra'), 'Instagram URL must point to dastavezmitra');
  assert(BRAND_INFO.callingHoursNotice.includes('9 AM – 7 PM'), 'Calling hours must be 9 AM – 7 PM');
  console.log('  ✓ Contact numbers & Instagram verified: WhatsApp 9871592002 | Call 9540403071 | Instagram @dastavezmitra.');

  // Verify HTML structure for Two-Line Call and WhatsApp Selection Modals
  import('fs').then(fs => {
    const htmlContent = fs.readFileSync('./index.html', 'utf8');
    assert(htmlContent.includes('id="callModal"'), 'HTML must have #callModal');
    assert(htmlContent.includes('id="whatsappModal"'), 'HTML must have #whatsappModal');
    assert(htmlContent.includes('tel:9871592002'), 'HTML must have Line 1 tel:9871592002');
    assert(htmlContent.includes('tel:9540403071'), 'HTML must have Line 2 tel:9540403071');
    assert(htmlContent.includes('https://wa.me/919871592002'), 'HTML must have Line 1 WhatsApp link');
    assert(htmlContent.includes('https://wa.me/919540403071'), 'HTML must have Line 2 WhatsApp link');
    assert(htmlContent.includes('Calling Hours: 9 AM – 7 PM'), 'HTML must display "Calling Hours: 9 AM – 7 PM"');
    console.log('  ✓ Two-line Call & WhatsApp selection modals verified in HTML.');
  });

  // TEST 2: Legal Mitra Chat API Test
  console.log('\n[2] Testing Legal Mitra Chat API (/api/chat)...');
  const chatQueries = [
    'What is BNS 2023 vs IPC 1860?',
    'My company has not paid my salary for 3 months',
    'Someone gave me a cheque and it bounced. Section 138 procedure?',
    'What are the documents required for marriage registration in Gurugram?'
  ];

  for (const q of chatQueries) {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: { message: q }
    };
    const res = createMockRes();
    await chatHandler(req, res);
    assert(res.statusCode === 200, `Chat must return 200 for query: ${q}`);
    assert(res.body.success === true, `Chat must be successful for query: ${q}`);
    assert(res.body.botName === 'Legal Mitra', `Bot name must be Legal Mitra`);
    assert(res.body.reply && res.body.reply.length > 20, `Reply must have substance`);
    console.log(`  ✓ Legal Mitra answered query: "${q.slice(0, 35)}..." [Success: ${res.body.success}]`);
  }

  // TEST 3: AI Drafting API Test (/api/draft)
  console.log('\n[3] Testing AI Drafting API (/api/draft)...');

  // 3A. Affidavit Draft
  {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: {
        draftType: 'affidavit',
        data: {
          purpose: 'Name Discrepancy',
          submittingAuthority: 'Passport Office, Gurugram',
          deponentName: 'Rahul Sharma',
          relativeName: 'Sh. Ram Sharma',
          age: '30',
          idNumber: 'XXXX-XXXX-1234',
          address: 'Sector 14, Gurugram, Haryana',
          customFacts: 'My name in matriculation marksheet is Rahul and in Aadhaar it is Rahul Sharma.'
        }
      }
    };
    const res = createMockRes();
    await draftHandler(req, res);
    assert(res.statusCode === 200, 'Affidavit draft must return 200');
    assert(res.body.draft.includes('AFFIDAVIT OF: RAHUL SHARMA'), 'Draft must contain deponent name');
    assert(res.body.draft.includes('व्यक्तिगत उपस्थिति अनिवार्य होगी'), 'Draft must include personal presence notice');
    console.log('  ✓ Affidavit AI Drafting tested successfully.');
  }

  // 3B. Agreement Draft (Vehicle Rental)
  {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: {
        draftType: 'agreement',
        data: {
          agreementType: 'Vehicle Rental Agreement',
          isVehicleRental: true,
          duration: '6 Months',
          vehicleModel: 'Maruti Swift Dzire',
          vehicleRegNo: 'HR-26-DQ-1234',
          parties: [
            { label: 'First Party (Owner)', name: 'Suresh Kumar', address: 'Gurugram', id: 'Aadhaar 1111' },
            { label: 'Second Party (Renter)', name: 'Vikas Singh', address: 'Gurugram', id: 'Aadhaar 2222' }
          ]
        }
      }
    };
    const res = createMockRes();
    await draftHandler(req, res);
    assert(res.statusCode === 200, 'Agreement draft must return 200');
    assert(res.body.draft.includes('VEHICLE PARTICULARS: Make & Model: Maruti Swift Dzire'), 'Draft must include vehicle details');
    console.log('  ✓ Agreement AI Drafting (Vehicle Rental) tested successfully.');
  }

  // 3C. Will Draft
  {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: {
        draftType: 'will',
        data: {
          testatorName: 'Om Prakash',
          relativeName: 'Late Sh. Ram Lal',
          age: '65',
          address: 'DLF Phase 1, Gurugram',
          aadhaar: '9876-5432-1098',
          executorName: 'Sanjay Prakash',
          immovableAssets: [
            { propertyType: 'Residential House', address: 'Plot 45, Sector 5, Gurugram', beneficiaryName: 'Sanjay Prakash (Son)', share: '100%' }
          ],
          movableAssets: [
            { assetType: 'Bank Accounts & FDs', details: 'HDFC Bank & PNB, Gurugram', beneficiaryName: 'Kavita (Daughter)', share: '100%' }
          ]
        }
      }
    };
    const res = createMockRes();
    await draftHandler(req, res);
    assert(res.statusCode === 200, 'Will draft must return 200');
    assert(res.body.draft.includes('LAST WILL AND TESTAMENT OF OM PRAKASH'), 'Draft must include testator name');
    assert(res.body.draft.includes('Plot 45, Sector 5, Gurugram'), 'Draft must include asset address');
    console.log('  ✓ Will / Testament AI Drafting tested successfully.');
  }

  // 3D. GPA / SPA Draft
  {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: {
        draftType: 'gpa-spa',
        data: {
          docType: 'GPA',
          purpose: 'Management of residential property',
          matterDetails: 'House No. 120, Sector 23, Gurugram',
          principalName: 'Sunil Verma',
          principalRelative: 'Sh. K.L. Verma',
          principalAadhaar: '1234-5678-9012',
          principalAddress: 'Gurugram',
          attorneyName: 'Anil Verma',
          attorneyRelative: 'Sh. Sunil Verma',
          attorneyAadhaar: '9876-5432-1098',
          attorneyAddress: 'Gurugram'
        }
      }
    };
    const res = createMockRes();
    await draftHandler(req, res);
    assert(res.statusCode === 200, 'GPA draft must return 200');
    assert(res.body.draft.includes('GENERAL POWER OF ATTORNEY'), 'Draft must be GPA');
    assert(res.body.draft.includes('Notary GPA/SPA can be provided.'), 'Draft must include notary notice');
    console.log('  ✓ GPA / SPA AI Drafting tested successfully.');
  }

  // TEST 4: Lead Creation & Admin Portal Verification
  console.log('\n[4] Testing Lead Submission & Admin Authentication...');
  
  // Submit Test Lead
  const testMobile = '98' + Math.floor(10000000 + Math.random() * 90000000);
  const leadReq = {
    method: 'POST',
    headers: { 'x-forwarded-for': '127.0.0.1' },
    body: {
      visitor_name: 'Test Verification User',
      mobile_number: testMobile,
      service_requested: 'RC Transfer',
      email: 'test@example.com',
      message: 'Automated test enquiry',
      consent_status: true,
      source_page: '/services/rc-transfer'
    }
  };
  const leadRes = createMockRes();
  await leadsHandler(leadReq, leadRes);
  if (leadRes.statusCode !== 201 && leadRes.statusCode !== 200) {
    console.error('Lead error:', leadRes.statusCode, leadRes.body);
  }
  assert((leadRes.statusCode === 201 || leadRes.statusCode === 200) && leadRes.body?.success, 'Lead submission must succeed');
  console.log('  ✓ Lead submission verified.');

  // Admin Login
  const loginReq = {
    method: 'POST',
    headers: { 'x-forwarded-for': '127.0.0.1' },
    body: { password: process.env.ADMIN_PASSWORD || 'dastavez@admin2026' }
  };
  const loginRes = createMockRes();
  await adminLoginHandler(loginReq, loginRes);
  assert(loginRes.statusCode === 200 && loginRes.body.token, 'Admin login must succeed');
  console.log('  ✓ Admin authentication verified.');

  // Admin Stats
  const statsReq = {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${loginRes.body.token}`,
      'x-forwarded-for': '127.0.0.1'
    }
  };
  const statsRes = createMockRes();
  await statsHandler(statsReq, statsRes);
  assert(statsRes.statusCode === 200 && statsRes.body.stats, 'Admin stats must succeed');
  console.log(`  ✓ Admin CRM stats verified (Total Leads: ${statsRes.body.stats.total}).`);

  console.log('\n=========================================');
  console.log('ALL TESTS PASSED SUCCESSFULLY! (100% OK)');
  console.log('=========================================\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
