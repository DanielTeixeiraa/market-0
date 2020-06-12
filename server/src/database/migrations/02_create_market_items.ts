import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("markets_items", (table) => {
    table.increments("id").primary();

    table.integer("market_id")
    .notNullable()
    .references("id")
    .inTable("markets");

    table.integer("items_id")
    .notNullable()
    .references("id")
    .inTable("items");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropSchema("markets_items");
}
