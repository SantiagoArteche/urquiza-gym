import { Routes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  const instance = new Server(7000, Routes.router);
  instance.start();
})();
