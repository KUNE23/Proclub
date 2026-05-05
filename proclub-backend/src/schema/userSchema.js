const { z } = require("zod");

const createUserSchema = z.object({
    name: 
    z.string()
    .trim()
    .regex(/^[a-zA-Z\s']+$/, "Name must contain only letters and spaces")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
    email: 
    z.string()
    .trim()
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters"),
    password: 
    z.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
    role: z.enum(['admin', 'mentor', 'member']).optional()
});

const updateUserSchema = z.object({
    name: 
    z.string()
    .trim()
    .regex(/^[a-zA-Z\s']+$/, "Name must contain only letters and spaces")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
    email: 
    z.string()
    .trim()
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters")
    .optional(),
    password: 
    z.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .optional(),
    role: z.enum(['admin', 'mentor', 'member']).optional()
});

const updateProfileSchema = z.object({
    name: 
    z.string()
    .trim()
    .regex(/^[a-zA-Z\s']+$/, "Name must contain only letters and spaces")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
    email: 
    z.string()
    .trim()
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters")
    .optional()
});

module.exports = { createUserSchema, updateUserSchema, updateProfileSchema };