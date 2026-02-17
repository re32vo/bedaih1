// In-memory OTP storage (will be cleared on server restart - this is intentional for security)
type OTPRecord = {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  lastRequestTime?: number;
  metadata?: any; // For storing additional data like name, phone, isRegistration
};

type TokenRecord = {
  email: string;
  createdAt: number;
};

// Supabase client for token persistence
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_OTP_REQUESTS_PER_WINDOW = 3;
const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Track OTP request attempts
const otpRequestTracker = new Map<string, number[]>();

const otpMap = new Map<string, OTPRecord>();
const tokenMap = new Map<string, TokenRecord>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

/**
 * Check if email is rate-limited for OTP requests
 */
export function isOTPRequestRateLimited(email: string): { limited: boolean; reason?: string } {
  const now = Date.now();
  const otp = otpMap.get(email);
  
  // Check if account is locked due to too many failed attempts
  if (otp && otp.attempts >= MAX_OTP_ATTEMPTS && otp.lastRequestTime) {
    const lockExpiry = otp.lastRequestTime + OTP_LOCK_TIME;
    if (now < lockExpiry) {
      return { 
        limited: true, 
        reason: `محاولات كثيرة. يرجى المحاولة مرة أخرى بعد ${Math.ceil((lockExpiry - now) / 1000 / 60)} دقائق` 
      };
    }
  }

  // Check request rate limiting
  const requests = otpRequestTracker.get(email) || [];
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_OTP_REQUESTS_PER_WINDOW) {
    return { 
      limited: true, 
      reason: "عدد الطلبات كثير جداً. يرجى المحاولة لاحقاً" 
    };
  }

  return { limited: false };
}

/**
 * Track OTP request for rate limiting
 */
export function trackOTPRequest(email: string) {
  const now = Date.now();
  const requests = otpRequestTracker.get(email) || [];
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  recentRequests.push(now);
  otpRequestTracker.set(email, recentRequests);
}

export function storeOTP(email: string, code: string, expirationMinutes = 5, metadata?: any) {
  const expiresAt = Date.now() + expirationMinutes * 60 * 1000;
  otpMap.set(email, { email, code, expiresAt, attempts: 0, lastRequestTime: Date.now(), metadata });
}

export function verifyOTP(email: string, code: string): any {
  const record = otpMap.get(email);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    otpMap.delete(email);
    return null;
  }
  record.attempts++;
  if (record.attempts > 5) {
    otpMap.delete(email);
    return null;
  }
  if (record.code === code) {
    const metadata = record.metadata;
    otpMap.delete(email);
    return metadata || true; // Return metadata if available, otherwise true
  }
  return null;
}

export function invalidateOTP(email: string) {
  otpMap.delete(email);
}

// Token management with persistent storage in Supabase
export function storeToken(token: string, email: string) {
  // Store in memory for immediate access
  tokenMap.set(token, { email, createdAt: Date.now() });
  
  // Also store in database for persistence across restarts (non-blocking)
  if (supabase) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    (async () => {
      try {
        await supabase
          .from('tokens')
          .insert({
            token,
            email: email.toLowerCase(),
            expires_at: expiresAt,
            created_at: new Date().toISOString(),
          })
          .select();
      } catch (err) {
        console.error('[storeToken] Database error:', err);
        // Continue anyway, we have in-memory fallback
      }
    })();
  }
}

export function verifyToken(token: string): string | null {
  // First check in-memory cache
  const record = tokenMap.get(token);
  if (record) {
    // Token expires after 24 hours
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - record.createdAt > twentyFourHours) {
      invalidateToken(token);
      return null;
    }
    return record.email;
  }
  
  return null;
}

// Async version for when we need to check database after cold start
export async function verifyTokenAsync(token: string): Promise<string | null> {
  // First check in-memory cache
  const record = tokenMap.get(token);
  if (record) {
    // Token expires after 24 hours
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - record.createdAt > twentyFourHours) {
      invalidateToken(token);
      return null;
    }
    return record.email;
  }
  
  // If not in memory, check database (e.g., after cold start)
  if (supabase) {
    try {
      const { data } = await supabase
        .from('tokens')
        .select('email, expires_at')
        .eq('token', token)
        .maybeSingle();
      
      if (data && data.expires_at) {
        const expiresAt = new Date(data.expires_at).getTime();
        if (Date.now() < expiresAt) {
          // Cache it in memory for performance
          tokenMap.set(token, { email: data.email, createdAt: Date.now() });
          return data.email;
        }
      }
    } catch (err) {
      console.error('[verifyTokenAsync] Database error:', err);
    }
  }
  
  return null;
}

export function invalidateToken(token: string) {
  tokenMap.delete(token);
}
