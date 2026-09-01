import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// In-memory cache for fast serverless operations
let inMemoryLeads = [];
let isInitialized = false;

// Storage file path (works in /tmp on Vercel and locally)
const STORAGE_DIR = process.env.VERCEL ? '/tmp' : path.resolve(process.cwd(), '.data');
const STORAGE_FILE = path.join(STORAGE_DIR, 'leads.json');

/**
 * Initialize storage directory and load initial data
 */
function ensureStorage() {
  if (isInitialized) return;
  
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }

    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      inMemoryLeads = JSON.parse(data || '[]');
    } else {
      // Seed sample lead structure if totally empty for clean demonstration
      inMemoryLeads = [];
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(inMemoryLeads, null, 2), 'utf8');
    }
  } catch (err) {
    // If filesystem is read-only, maintain in-memory array
    inMemoryLeads = inMemoryLeads || [];
  }
  
  isInitialized = true;
}

/**
 * Persist leads to disk / backend
 */
function persistLeads() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(inMemoryLeads, null, 2), 'utf8');
  } catch (err) {
    // In serverless environments where disk may be transient, in-memory remains active
  }
}

/**
 * Sanitize text input to prevent XSS / HTML injection
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // remove direct angle brackets
    .slice(0, 1000); // enforce max length
}

/**
 * Normalize and validate Indian mobile number
 * Accept: 10 digits starting with 6, 7, 8, 9 (with optional +91 or 0 prefix)
 */
export function validateAndNormalizeMobile(mobile) {
  if (!mobile || typeof mobile !== 'string') return null;
  
  // Strip spaces, dashes, parentheses
  let cleaned = mobile.replace(/[\s\-\(\)\+]/g, '');
  
  // Strip leading 91 or 0 if 11/12 digits
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Check if exactly 10 digits starting with 6-9
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email) return true; // Optional field
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim()) && email.length <= 120;
}

/**
 * Create a new Lead record
 */
export async function createLead({
  visitor_name,
  mobile_number,
  email = '',
  service_requested,
  message = '',
  consent_status,
  source_page = '/',
  ip = ''
}) {
  ensureStorage();

  // Validate Required Fields
  const cleanName = sanitizeInput(visitor_name);
  if (!cleanName || cleanName.length < 2) {
    throw new Error('Please enter a valid full name (minimum 2 characters).');
  }

  const normalizedMobile = validateAndNormalizeMobile(mobile_number);
  if (!normalizedMobile) {
    throw new Error('Please enter a valid 10-digit Indian mobile number.');
  }

  const cleanEmail = sanitizeInput(email);
  if (cleanEmail && !validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const cleanService = sanitizeInput(service_requested) || 'Other / General Enquiry';
  const cleanMessage = sanitizeInput(message);
  const cleanSource = sanitizeInput(source_page) || '/';

  if (!consent_status) {
    throw new Error('Please confirm your consent to be contacted regarding this enquiry.');
  }

  // Prevent duplicate submissions within 2 minutes for the same mobile and service
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const isDuplicate = inMemoryLeads.some(
    lead => lead.mobile_number === normalizedMobile &&
            lead.service_requested === cleanService &&
            lead.created_at > twoMinutesAgo
  );

  if (isDuplicate) {
    throw new Error('You have already submitted an enquiry for this service recently. Our team will contact you shortly.');
  }

  const newLead = {
    id: `dm_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    visitor_name: cleanName,
    mobile_number: normalizedMobile,
    email: cleanEmail,
    service_requested: cleanService,
    message: cleanMessage,
    consent_status: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lead_status: 'New', // New, Contacted, Follow-up, Converted, Closed
    source_page: cleanSource,
    notes: '',
    ip_hash: ip ? crypto.createHash('sha256').update(ip).digest('hex').substring(0, 10) : ''
  };

  inMemoryLeads.unshift(newLead);
  persistLeads();

  return newLead;
}

/**
 * Get all Leads with filtering & search (Admin Only)
 */
export async function getLeads({
  status = 'all',
  service = 'all',
  search = '',
  sortBy = 'newest',
  limit = 100,
  offset = 0
} = {}) {
  ensureStorage();

  let results = [...inMemoryLeads];

  // Filter by Status
  if (status && status !== 'all') {
    results = results.filter(l => l.lead_status.toLowerCase() === status.toLowerCase());
  }

  // Filter by Service
  if (service && service !== 'all') {
    results = results.filter(l => l.service_requested.toLowerCase() === service.toLowerCase());
  }

  // Search by Name, Mobile, or Notes
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(l =>
      l.visitor_name.toLowerCase().includes(q) ||
      l.mobile_number.includes(q) ||
      l.service_requested.toLowerCase().includes(q) ||
      (l.notes && l.notes.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sortBy === 'oldest') {
    results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else {
    // Newest first by default
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const total = results.length;
  const paginated = results.slice(offset, offset + limit);

  return {
    total,
    leads: paginated
  };
}

/**
 * Update Lead Status or Internal Notes (Admin Only)
 */
export async function updateLead(leadId, { lead_status, notes }) {
  ensureStorage();

  const leadIndex = inMemoryLeads.findIndex(l => l.id === leadId);
  if (leadIndex === -1) {
    throw new Error('Lead not found.');
  }

  const validStatuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Closed'];
  if (lead_status && validStatuses.includes(lead_status)) {
    inMemoryLeads[leadIndex].lead_status = lead_status;
  }

  if (notes !== undefined) {
    inMemoryLeads[leadIndex].notes = sanitizeInput(notes);
  }

  inMemoryLeads[leadIndex].updated_at = new Date().toISOString();
  persistLeads();

  return inMemoryLeads[leadIndex];
}

/**
 * Compute Lead Statistics for Admin Dashboard
 */
export async function getLeadStats() {
  ensureStorage();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const stats = {
    total: inMemoryLeads.length,
    today: inMemoryLeads.filter(l => l.created_at >= startOfToday).length,
    new: inMemoryLeads.filter(l => l.lead_status === 'New').length,
    contacted: inMemoryLeads.filter(l => l.lead_status === 'Contacted').length,
    followup: inMemoryLeads.filter(l => l.lead_status === 'Follow-up').length,
    converted: inMemoryLeads.filter(l => l.lead_status === 'Converted').length,
    closed: inMemoryLeads.filter(l => l.lead_status === 'Closed').length,
    serviceDemand: {},
    storageMode: process.env.DATABASE_URL ? 'Cloud Database' : 'Serverless Cache Storage'
  };

  // Calculate most requested services
  inMemoryLeads.forEach(l => {
    const s = l.service_requested || 'Other / General Enquiry';
    stats.serviceDemand[s] = (stats.serviceDemand[s] || 0) + 1;
  });

  return stats;
}
