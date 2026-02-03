// Simple in-memory rate limiter for note creation
// Max 5 note creations per minute per IP
const rateLimitMap = new Map();

const RATE_LIMIT = 5; // Max requests
const WINDOW_MS = 60 * 1000; // 1 minute

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Get or create user's request history
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requestTimestamps = rateLimitMap.get(ip);
  
  // Remove old timestamps outside the time window
  const validTimestamps = requestTimestamps.filter(
    timestamp => now - timestamp < WINDOW_MS
  );
  
  // Check if limit exceeded
  if (validTimestamps.length >= RATE_LIMIT) {
    return res.status(429).json({
      success: false,
      error: "Rate limit exceeded. Maximum 5 note creations per minute allowed.",
    });
  }
  
  // Add current timestamp
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  
  // Cleanup old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupOldEntries();
  }
  
  next();
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < WINDOW_MS
    );
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validTimestamps);
    }
  }
}

module.exports = rateLimiter;
