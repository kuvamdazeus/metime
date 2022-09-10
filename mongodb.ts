import { Db, MongoClient } from "mongodb";

const mongoUrl = process.env.MONGO_URL as string;

let db: Db | null = null;

export default async function getMongoDB() {
  if (db) return db;

  const client = new MongoClient(mongoUrl);
  await client.connect();

  db = client.db("db");
  return db;
}
