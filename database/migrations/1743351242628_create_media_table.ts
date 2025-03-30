import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('file_name').notNullable()
      table.string('file_path').notNullable()
      table.string('file_type').notNullable()
      table.integer('file_size').unsigned().notNullable()
      table.integer('business_id').unsigned().notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.foreign('business_id').references('id').inTable('businesses').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}