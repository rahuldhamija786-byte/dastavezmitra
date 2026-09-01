import { createLead, getLeads } from './_storage.js';
import { checkRateLimit, getClientIp, authenticateAdmin } from './_auth.js';

export default async function handler(req, res) {
  // Set common security & CORS headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const clientIp = getClientIp(req);

  // ==========================================
  // POST /api/leads (Public Lead Submission)
  // ==========================================
  if (req.method === 'POST') {
    // 1. Rate Limiting: Max 5 submissions per 10 minutes per IP
    const isAllowed = checkRateLimit(clientIp, 5, 10 * 60 * 1000);
    if (!isAllowed) {
      return res.status(429).json({
        success: false,
        error: 'Too many submissions from this connection. Please wait a few minutes or contact us directly on WhatsApp.'
      });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

      // 2. Anti-Spam Honeypot check
      if (body.website_hp && body.website_hp.trim() !== '') {
        // Bot detected - return fake success without storing
        return res.status(200).json({
          success: true,
          message: 'Thank you. Your enquiry has been received. DASTAVEZ MITRA will contact you shortly.'
        });
      }

      // 3. Create Lead
      const newLead = await createLead({
        visitor_name: body.visitor_name || body.name,
        mobile_number: body.mobile_number || body.mobile,
        email: body.email,
        service_requested: body.service_requested || body.service,
        message: body.message,
        consent_status: body.consent_status === true || body.consent === true,
        source_page: body.source_page,
        ip: clientIp
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you. Your enquiry has been received. DASTAVEZ MITRA will contact you shortly.',
        lead_id: newLead.id
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Something went wrong while processing your enquiry. Please try again or contact us directly on WhatsApp.'
      });
    }
  }

  // ==========================================
  // GET /api/leads (Protected Admin View)
  // ==========================================
  if (req.method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin authentication required to view lead database.'
      });
    }

    try {
      const { status, service, search, sortBy, limit, offset } = req.query || {};
      const data = await getLeads({
        status,
        service,
        search,
        sortBy,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      });

      return res.status(200).json({
        success: true,
        ...data
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve enquiries.'
      });
    }
  }

  // Method Not Allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`
  });
}
