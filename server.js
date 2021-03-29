const express = require("express");
const server = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;

const createEchoResponse = require('./create-response.js')

// Настройка CORS
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, PUT, POST, DELETE, OPTIONS"
    );
    next();
  });

server
  .use(bodyParser.json())
  .post("/webhook", (req, res) => res.json(createEchoResponse(req.body)))
  .listen(port, () => {
    console.log("Сервер запущен на http://localhost:" + port);
  });