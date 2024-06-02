const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const app = require("./app");
/** Handle the app uncaught errors. */
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection");
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception.");
  process.exit(1);
});

/** Connect to the database. */
let url = process.env.DB_CONNECTION;
url = url.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(url, {
  serverSelectionTimeoutMS: 10000 /**Timeout after 10sec */,
});
/** Handle the database connection errors. */
const db = mongoose.connection;
db.on("connected", () => {
  console.log("Connected to the database");
});
db.on("error", console.error.bind(console, "Database Connection error"));

/** Making the server listen to requests. */
const port = process.env.PORT | 3000;

app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});
