import { createClient } from "redis";

const internals = { client: undefined };

export const connectRedis = async () => {
  if (!internals.client) {
    const client = createClient();
    await client.connect();
    internals.client = client;
    console.log("COnnected succesfully to redis");
  }
};

export const getRedisClient = () => {
  if (!internals.client) throw new Error("Redis wasn't inited!!!");
  return internals.client;
};

export const disconnectRedis = async () => {
  if (internals.client) {
    await internals.client.disconnect();
  }
};

const DAY = 60 * 60 * 24;
export const redisOporations = () => {
  const set = async (key, val) => {
    await internals.client.set(key, JSON.stringify(val), { EX: DAY });
  };
  const get = async (key) => {
    return JSON.parse(await internals.client.get(key));
  };
  return { get, set };
};

export default internals;
