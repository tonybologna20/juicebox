require("dotenv").config();

const jwt = require("jsonwebtoken");
const token = jwt.sign({ id: 3, username: "joshua" }, "server secret", {
  expiresIn: "1 week",
});
token;

const recoveredData = jwt.verify(token, "server secret");

recoveredData;

jwt.verify(token, "server secret");

const PORT = 3000;
const express = require("express");
const server = express();

const { client } = require("./db");
client.connect();
server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
const apiRouter = require("./api");
server.use("/api", apiRouter);

const morgan = require("morgan");

server.use(morgan("dev"));

server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});
