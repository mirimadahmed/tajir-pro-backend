import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'businesses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.string('category_slug').notNullable()
      table.string('location').notNullable()
      table.string('phone').nullable()
      table.string('whatsapp').nullable()
      table.string('website').nullable()
      table.enum('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending')
      table.text('rejection_reason').nullable()
      table.integer('owner_id').unsigned().notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.foreign('owner_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('category_slug').references('slug').inTable('categories').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}