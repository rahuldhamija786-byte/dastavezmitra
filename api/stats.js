import { getLeadStats } from './_storage.js';
import { authenticateAdmin } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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
    const stats = await getLeadStats();
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve stats.'
    });
  }
}
