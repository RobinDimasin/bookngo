"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const utils_1 = require("../shared/utils");
dotenv_1.default.config();
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev, hostname: utils_1.HOSTNAME, port: utils_1.PORT });
const handle = app.getRequestHandler();
app.prepare().then(async () => {
    (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(utils_1.PORT);
    await database_1.Database.init();
    // tslint:disable-next-line:no-console
    console.log(`> Server listening at http://${utils_1.HOSTNAME}:${utils_1.PORT} as ${dev ? "development" : process.env.NODE_ENV}`);
});
