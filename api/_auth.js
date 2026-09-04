import crypto from 'crypto';

const DEFAULT_SECRET = 'dastavez_mitra_secret_token_key_2026_secure';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dastavez@admin2026';

// In-memory rate limiting map for IP addresses
const rateLimitMap = new Map();

/**
 * Rate limiter middleware
 * @param {string} ip
 * @param {number} maxRequests
 * @param {number} windowMs
 * @returns {boolean} True if allowed, false if limit exceeded
 */
export function checkRateLimit(ip, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

  if (now - clientData.firstRequest > windowMs) {
    clientData.count = 1;
    clientData.firstRequest = now;
    rateLimitMap.set(ip, clientData);
    return true;
  }

  clientData.count += 1;
  rateLimitMap.set(ip, clientData);

  if (clientData.count > maxRequests) {
    return false;
  }
  return true;
}

/**
 * Timing-safe string comparison to prevent timing and length leakage attacks
 */
export function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Verify admin password
 */
export function verifyAdminPassword(inputPassword) {
  if (!inputPassword) return false;
  return timingSafeCompare(inputPassword, ADMIN_PASSWORD);
}

/**
 * Generate a signed session token
 */
export function generateToken(payload = { role: 'admin' }, expiresInHours = 24) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (expiresInHours * 3600);
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verify signed token
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (!timingSafeCompare(signature, expectedSignature)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Helper to extract client IP
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Authentication middleware for API requests
 */
export function authenticateAdmin(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    return verifyToken(token);
  }

  // Also check cookie if provided
  const cookieHeader = req.headers['cookie'] || '';
  const match = cookieHeader.match(/dm_admin_token=([^;]+)/);
  if (match) {
    return verifyToken(match[1]);
  }

  return null;
}

/**
 * Sanitize text input to prevent XSS and injection
 */
export function sanitizeInput(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim();
}
