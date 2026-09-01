import { verifyAdminPassword, generateToken, checkRateLimit, getClientIp } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);

  // Rate limit login attempts: Max 5 attempts per 15 minutes
  const isAllowed = checkRateLimit(`login_${clientIp}`, 5, 15 * 60 * 1000);
  if (!isAllowed) {
    return res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Please wait 15 minutes before trying again.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { password } = body;

    if (!password) {
      return res.status(400).json({ success: false, error: 'Admin password is required.' });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid admin password.' });
    }

    // Generate 24-hour signed JWT session token
    const token = generateToken({ role: 'admin', auth_time: Date.now() }, 24);

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      expires_in: '24 hours'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error occurred.'
    });
  }
}
