import { Request, Response } from "express";
import knex from "../database/connection";

class MarketsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((items) => Number(items.trim()));

    const marketsa = await knex("markets")
      .join("markets_items", "markets.id", "=", "markets_items.market_id")
      .whereIn("markets_items.items_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("markets.*");

      const serializedMarkets = marketsa.map((markets) => {
        return {
          ...markets,
            image_url: `http://192.168.1.4:5000/uploads/${markets.image}` 
        };
      });

    return res.json(serializedMarkets);
  }

  async indexAll(req: Request, res: Response) {
    const markets = await knex("markets").select("*");

    const serializableMarkets = markets.map((market) => {
      return {
        name: market.name,
        email: market.email,
        city: market.city,
      };
    });

    res.json(serializableMarkets);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const market = await knex("markets").where("id", id).first();

    if (!market) {
      return res.status(400).json({ message: "Market not found" });
    }

    const serializedMarkets = {
        ...market,
          image_url: `http://192.168.1.4:5000/uploads/${market.image}` 
    };

    const items = await knex("items")
      .join("markets_items", "items.id", "=", "markets_items.items_id")
      .where("markets_items.market_id", id)
      .select("items.title");

    res.json({ market: serializedMarkets, items });
  }
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      descricao,
      latitude,
      longtude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await knex.transaction();

    const market = {
      image: req.file.filename,
      name,
      email,
      descricao,
      latitude,
      longtude,
      city,
      uf,
    };

    const insertedIds = await trx("markets").insert(market);
    const market_id = insertedIds[0];

    const marketItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((items_id: number) => {
        return {
          items_id,
          market_id,
        };
      });

    await trx("markets_items").insert(marketItems);
    await trx.commit();
    return res.json({
      id: market_id,
      ...market,
    });
  }
}

export default MarketsController;
