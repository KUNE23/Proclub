import { z } from 'zod'

const integerString = z.union([
  z.string().regex(/^[0-9]+$/, { message: 'categoryId must be a valid integer' }),
  z.number().int().positive()
])

const createCourseSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  categoryId: integerString.optional()
})

const updateCourseSchema = z.object({
  title: z.string().min(1, { message: 'Title cannot be empty' }).optional(),
  description: z.string().optional(),
  categoryId: integerString.optional()
})

export {
  createCourseSchema,
  updateCourseSchema
}
