import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('rating').unsigned().notNullable()
      table.text('comment').nullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('business_id').unsigned().notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('business_id').references('id').inTable('businesses').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}