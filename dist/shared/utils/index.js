"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.HOSTNAME = exports.BASE_URL = void 0;
exports.BASE_URL = process.env.NODE_ENV === "production"
    ? "https://book-n-go.herokuapp.com/"
    : "http://localhost:3000";
exports.HOSTNAME = process.env.NODE_ENV === "production"
    ? "book-n-go.herokuapp.com"
    : "localhost";
exports.PORT = parseInt(process.env.PORT || "3000", 10);
