import { MongoRepository } from "./data/mongoDB/mongo-repository";
import { Routes } from "./presentation/routes";
import { Server } from "./presentation/server";
import "dotenv/config";

(async () => {
  const instance = new Server(Number(process.env.PORT), Routes.router);
  instance.start();
  if (process.env.ENVIRONMENT === "production") await MongoRepository.connect();
})();
