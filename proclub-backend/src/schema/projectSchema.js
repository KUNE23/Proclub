const { z } = require("zod");

const submitProjectSchema = z.object({
    linkGithub: 
    z.string()
    .trim()
    .min(2, "GitHub link must be at least 2 characters")
    .max(255, "GitHub link must be at most 255 characters")
    .url({ message: "Format link tidak valid" })
    .refine((val) => val.includes('github.com'), {
      message: "Hanya link GitHub yang diperbolehkan",
    }),

    note: 
    z.string()
    .min(2, "Note must be at least 2 characters")
    .trim()
    .max(255, "Note must be at most 255 characters")
    .transform((val) => val.replace(/<[^>]*>?/gm, '')),

    courseId:
    z.number(),

    moduleId: 
    z.number()
    .optional(),

  });

module.exports = { submitProjectSchema };