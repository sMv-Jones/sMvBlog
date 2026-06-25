import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 20, 
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

export const userForgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    keyGenerator: (req, res) => {
        const email = req.body?.email?.toLowerCase().trim();
        const ip = ipKeyGenerator(req, res);
        return email ? `${ip}-${email}` : ip;
    },
    message: {
        success: false,
        message: "Too many password reset attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const userApiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 100, 
    keyGenerator: (req, res) => {
        return req.user?.userId || ipKeyGenerator(req, res);
    },
    message: {
        success: false,
        message: "Rate limit exceeded. Slow down your requests."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const userAuthChangeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    keyGenerator: (req, res) => {
        return req.user?.userId || ipKeyGenerator(req, res);
    },
    message: {
        success: false,
        message: "Rate limit exceeded. Slow down your requests."
    },
    standardHeaders: true,
    legacyHeaders: false,
});