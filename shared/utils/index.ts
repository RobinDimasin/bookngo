export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "book-n-go.vercel.app"
    : "http://localhost:3000";

export const HOSTNAME =
  process.env.NODE_ENV === "production" ? "book-n-go.vercel.app" : "localhost";
export const PORT = parseInt(process.env.PORT || "3000", 10);
