import { z } from 'zod'

const submitProjectSchema = z.object({
    linkGithub: 
    z.string()
    .trim()
    .min(12, "GitHub link must be at least 12 characters")
    .max(255, "GitHub link must be at most 255 characters")
    .url({ message: "Format link tidak valid" })
    .refine((val) => /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/.test(val), {
      message: "Hanya link GitHub yang diperbolehkan",
    }),

    note: 
    z.string()
    .trim()
    .max(255, "Note must be at most 255 characters")
    .transform((val) => val.replace(/<[^>]*>?/gm, ''))
    .optional()
    .default(''),

    courseId:
    z.number(),

    moduleId: 
    z.number()
    .optional(),

    lessonId:
    z.number()
    .optional(),

  });

const projectRequirementSchema = z.object({
  title: z.string().trim().min(3, 'Judul requirement minimal 3 karakter').max(120, 'Judul requirement maksimal 120 karakter'),
  description: z.string().trim().min(8, 'Deskripsi requirement minimal 8 karakter').max(500, 'Deskripsi requirement maksimal 500 karakter'),
  order: z.number().int().min(1, 'Urutan minimal 1').max(100, 'Urutan maksimal 100').optional()
});

export { submitProjectSchema, projectRequirementSchema };
