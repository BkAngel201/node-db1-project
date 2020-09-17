const express = require("express");

const accountRouter = require("./routers/accountRouter");
const server = express();

server.use(express.json());
server.use("/api/accounts", accountRouter);

module.exports = server;
