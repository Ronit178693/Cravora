import rateLimit from "express-rate-limit";

/**
 * Global API Rate Limiter
 * Protects against Denial-of-Service (DoS) and excessive API scraping.
 * Allows 300 requests every 15 minutes per IP (comfortably accommodating polling intervals).
 */
/**
 * Authentication Rate Limiter (Login & Register)
 * Prevents brute-force credential stuffing and automated bot registrations.
 * Allows a maximum of 10 attempts every 15 minutes per IP.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login/registration attempts from this IP. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate Limiting Middleware: Requesting Password Reset OTP
 * Limits the number of OTP requests an IP address can make to prevent email spamming.
 * Allows a maximum of 5 requests every 15 minutes.
 */
export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: "Too many password reset requests from this IP. Please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate Limiting Middleware: Verifying Password Reset OTP
 * Limits the number of OTP verification attempts to prevent brute-force attacks on the 6-digit code.
 * Allows a maximum of 5 attempts every 15 minutes.
 */
export const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5, // Limit each IP to 5 verification attempts per windowMs
    message: {
        success: false,
        message: "Too many failed OTP verification attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Order / Parcel Creation Rate Limiter
 * Prevents spamming order/package submissions and rapid duplicate clicks.
 * Allows a maximum of 20 creation requests every 10 minutes.
 */
export const createOrderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many order submissions. Please wait a few moments before placing another order."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

