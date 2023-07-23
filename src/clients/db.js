import { MongoClient } from "mongodb";

const internals = { client: undefined, collection: undefined };

const url = "mongodb://localhost:27017";

const dbName = "http-iterator-protocol";

export const connectDb = async () => {
  if (!internals.client) {
    const client = new MongoClient(url);
    await client.connect();
    internals.client = client;
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("airplane");
    internals.collection = collection;
  }
};

export const getDb = async () => {
  if (!internals.client) {
    await connectDb();
  }
  return internals.collection;
};

export default internals;
