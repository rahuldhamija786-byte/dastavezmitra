import { updateLead } from './_storage.js';
import { authenticateAdmin } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST' && req.method !== 'PATCH') {
    res.setHeader('Allow', ['POST', 'PATCH']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const admin = authenticateAdmin(req);
  if (!admin) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication required.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { id, lead_status, notes } = body;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Lead ID is required.' });
    }

    const updated = await updateLead(id, { lead_status, notes });

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      lead: updated
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to update lead.'
    });
  }
}
