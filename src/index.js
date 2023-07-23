import Express from "express";

import { connectRedis } from "./clients/redis";
import { connectDb } from "./clients/db";
import airplaneRouter from "./routes";

const port = process.env.PORT || 3000;

const start = async () => {
  const app = Express();
  await connectRedis();
  await connectDb();

  app.use(Express.json());
  app.use(airplaneRouter);
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

start();
