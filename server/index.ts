import { createServer } from "http";
import { parse } from "url";
import next from "next";
import dotenv from "dotenv";
import { Database } from "./database";
import { HOSTNAME, PORT } from "../shared/utils";
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname: HOSTNAME, port: PORT });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(PORT);

  await Database.init();

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://${HOSTNAME}:${PORT} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
