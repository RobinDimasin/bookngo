export const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const HOSTNAME =
  process.env.NODE_ENV === "production" ? "" : "localhost";
export const PORT = parseInt(process.env.PORT || "3000", 10);
