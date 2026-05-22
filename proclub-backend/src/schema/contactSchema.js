import { z } from 'zod'

const contactMessageSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z.string()
    .trim()
    .email('Email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  message: z.string()
    .trim()
    .min(10, 'Pesan minimal 10 karakter')
    .max(1000, 'Pesan maksimal 1000 karakter')
})

const updateContactMessageSchema = z.object({
  isRead: z.boolean()
})

export { contactMessageSchema, updateContactMessageSchema }
