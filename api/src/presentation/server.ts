import express, { Router } from "express";
import cors from "cors";

export class Server {
  public app = express();

  constructor(private readonly port: number, private readonly routes: Router) {}

  start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: "*" }));

    this.app.use(this.routes);

    this.app.listen(this.port, () =>
      console.log(`SERVER RUNNING ON PORT ${this.port}`)
    );
  }
}
