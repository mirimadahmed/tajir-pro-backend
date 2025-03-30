import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).confirmed(),
    role: vine.enum(['admin', 'business_owner'] as const),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string(),
  })
) 