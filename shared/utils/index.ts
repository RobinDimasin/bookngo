export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://book-n-go.herokuapp.com/"
    : "http://localhost:3000";

export const HOSTNAME =
  process.env.NODE_ENV === "production"
    ? "book-n-go.herokuapp.com"
    : "localhost";
export const PORT = parseInt(process.env.PORT || "3000", 10);
