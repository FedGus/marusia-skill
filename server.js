const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const createResponse = require("./create-response.js");
const { pick } = require("ramda");

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

// Парсинг json
server.use(bodyParser.json());

// Парсинг запросов по типу: application/x-www-form-urlencoded
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

server.post("/webhook", (req, res) => {
  try {
    if (req.body.session.new)
      res.json(createResponse.youStart(req.body));
    else if (req.body.request.command == "on_interrupt")
      res.json(createResponse.youStop(req.body));
    else {
      if (req.body.session.message_id == 1)
        res.json(createResponse.newWord(req.body)); else
        res.json(createResponse.youVersion(req.body));
    }
  } catch (err) {
    console.log("Ошибка ", err);
    res.status(500).send(err);
  }
});


server.listen(port, () => {
  console.log("Сервер запущен на http://localhost:" + port);
});
