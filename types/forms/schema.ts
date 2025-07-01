import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const createWorkspaceSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s-'']+$/,
        'Name can only contain letters, spaces, hyphens, and apostrophes',
      )
      .transform(name => name.trim()),
    image: z.string().optional(),
  }),
)

export const deleteWorkspaceSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s-'']+$/,
        'Name can only contain letters, spaces, hyphens, and apostrophes',
      )
      .transform(name => name.trim()),
  }),
)

export const setupPasswordSchema = toTypedSchema(
  z.object({
    password: z
      .string()
      .min(8, 'Password shouldn\'t be less than 8 characters'),
  }),
)

export const resetPasswordSchema = toTypedSchema(
  z.object({
    newPassword: z
      .string()
      .min(8, 'Password shouldn\'t be less than 8 characters'),
    password: z
      .string()
      .min(8, 'Password shouldn\'t be less than 8 characters'),
  }),
)
