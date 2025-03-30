import vine from '@vinejs/vine'

export const createBusinessValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().optional(),
    categorySlug: vine.string().trim(),
    location: vine.string().trim(),
    phone: vine.string().trim().mobile().optional(),
    whatsapp: vine.string().trim().mobile().optional(),
    website: vine.string().trim().url().optional(),
  })
)

export const updateBusinessValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().optional(),
    categorySlug: vine.string().trim().optional(),
    location: vine.string().trim().optional(),
    phone: vine.string().trim().mobile().optional(),
    whatsapp: vine.string().trim().mobile().optional(),
    website: vine.string().trim().url().optional(),
  })
) 