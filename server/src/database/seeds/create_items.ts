import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("items").insert([
    { title: "Ø Açucar", image: "diabetic.svg" },
    { title: "Ø Glutem", image: "glutem.svg" },
    { title: "Ø Lactose", image: "lactose.svg" },
    { title: "Ø Soja", image: "soja.svg" },
    { title: "Ø Carne ", image: "meat.svg" },
    { title: "Vegana", image: "vegan.svg" },
  ]);
}
