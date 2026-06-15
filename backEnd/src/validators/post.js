import { body, param } from "express-validator";

export const createPostValidation = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters long"),
    body("slug")
        .optional()
        .trim()
        .toLowerCase()
        .matches(/^[a-z0-9-]+$/).withMessage("Invalid slug structure provided"),
    body("content")
        .trim()
        .notEmpty().withMessage("Content is structural text requirement")
        .isLength({ min: 20 }).withMessage("Content requires a detailed narrative structure"),
    body("status")
        .optional()
        .isIn(["active", "inactive"]).withMessage("Invalid operational status toggle")
];

export const updatePostValidation = [
    param("slug")
        .matches(/^[a-z0-9-]+$/).withMessage("Target identification payload invalid"),
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }),
    body("content")
        .optional()
        .trim()
        .isLength({ min: 20 }),
    body("status")
        .optional()
        .isIn(["active", "inactive"])
];