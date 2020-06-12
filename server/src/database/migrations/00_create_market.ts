import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("markets", (table) => {
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("descricao").notNullable();
    table.decimal("latitude").notNullable();
    table.decimal("longtude").notNullable();
    table.string("city").notNullable();
    table.string("uf").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropSchema("markets");
}
