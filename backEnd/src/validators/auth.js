import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name must only contain letters and spaces"),

    body("email")
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Must contain at least one number")
];

export const loginValidation = [
    body("email")
        .trim()
        .toLowerCase()
        .isEmail().withMessage("Provide a valid login account profile"),
    body('password')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New secure password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one numeric digit')
];

export const emailValidation = [
    body("email")
        .trim()
        .toLowerCase()
        .isEmail().withMessage("Please present a valid email configuration"),
];


export const updateProfileValidator = [
    // 1. Validate Bio
    body('bio')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),

    // 2. Validate Nested GitHub Link
    body('socialLinks.github')
        .optional({ checkFalsy: true }) // Doesn't fail if left blank
        .trim()
        .isURL().withMessage('GitHub link must be a valid URL structure')
        .custom((value) => {
            const isGithub = /^(https?:\/\/)?(www\.)?github\.com/i.test(value);
            if (!isGithub) {
                throw new Error('Must be a valid GitHub profile link');
            }
            return true;
        }),

    // 3. Validate Nested LinkedIn Link
    body('socialLinks.linkedin')
        .optional({ checkFalsy: true }) // Doesn't fail if left blank
        .trim()
        .isURL().withMessage('LinkedIn link must be a valid URL structure')
        .custom((value) => {
            const isLinkedin = /^(https?:\/\/)?(www\.)?linkedin\.com/i.test(value);
            if (!isLinkedin) {
                throw new Error('Must be a valid LinkedIn profile link');
            }
            return true;
        })
];

/**
 * VALIDATE PASSWORD CHANGE WITH OTP
 */
export const changePasswordValidator = [
    body('currentPassword')
        .notEmpty().withMessage('Current validation password is required'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New secure password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one numeric digit'),

    body('otp')
        .notEmpty().withMessage('Verification code is required')
        .matches(/^\d{6}$/).withMessage('OTP must be a 6-digit number')
];

/**
 * VALIDATE ACCOUNT DELETION WITH OTP
 */
export const deleteAccountValidator = [
    body('otp')
        .notEmpty().withMessage('Verification code is required')
        .matches(/^\d{6}$/).withMessage('OTP must be a 6-digit number')
];

/**
 * Keep your original registration OTP validator completely untouched
 */
export const verifyOtpValidation = [
    body('otp')
        .matches(/^\d{6}$/)
        .withMessage('OTP must be a 6-digit number'),
];