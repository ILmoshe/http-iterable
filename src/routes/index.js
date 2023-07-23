import { v4 as uuidv4 } from "uuid";

import { Router } from "express";

import mongo from "../clients/db.js";
import { redisOporations } from "../clients/redis.js";

const redisClient = redisOporations();

const router = Router();

// This route actually start ('post') the iterator
router.post("/flights", async (req, res) => {
  const { airplane, n } = req.body;
  const query = { "airplane.name": airplane };
  const projection = {};

  const [iterationNumber, next] = await iter({ query, projection, n });

  res.send({ next, iterationNumber, detail: "starting post request" });
});

// This route suply next
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const { query, projection, iterationNumber, n } = await redisClient.get(id);
  const relevatFligths = await mongo.collection
    .find(query)
    .sort({ priority: 1 })
    .skip(n * (iterationNumber - 1))
    .limit(n)
    .toArray();

  let _next;
  if (relevatFligths.length === 0) {
    _next = null;
  } else {
    _next = await next(id);
  }

  res.send({ result: relevatFligths, next: _next });
});

/**
 *
 * @param {object}
 * @returns
 */
async function iter(object) {
  const iterationNumber = 1;

  const next = `${uuidv4()}_|_${iterationNumber}`;
  await redisClient.set(next, {
    ...object,
    iterationNumber,
  });
  return [iterationNumber, next];
}

/**
 *
 * @param {string} id
 * @returns {number}
 */
async function next(id) {
  const [nextId, iterationNumber] = buildNextId(id);
  const previous = await redisClient.get(id);
  await redisClient.set(nextId, { ...previous, iterationNumber });
  return nextId;
}

/**
 *
 * @param {string} id
 */
const buildNextId = (id) => {
  const splited = id.split("_|_");
  const nextNumber = Number(splited[1]) + 1;
  const newId = `${splited[0]}_|_${nextNumber}`;
  return [newId, nextNumber];
};

export default router;
