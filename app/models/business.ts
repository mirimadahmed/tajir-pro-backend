import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import type User from './user.js'
import type Review from './review.js'
import type Media from './media.js'

export default class Business extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare categorySlug: string

  @column()
  declare location: string

  @column()
  declare phone: string | null

  @column()
  declare whatsapp: string | null

  @column()
  declare website: string | null

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column()
  declare rejectionReason: string | null

  @column()
  declare ownerId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>

  @hasOne(() => Media)
  declare logo: HasOne<typeof Media>
} 