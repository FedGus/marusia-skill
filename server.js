const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const createEchoResponse = require("./create-response.js");
const { pick } = require("ramda");
let word = "сообщение";

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
    if (req.body.session["new"] == true) {
      res.json({
        response: {
          text:
            "Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но помните - у вас всего девять попыток",
          tts:
            "Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но помните - у вас всего девять попыток",
          buttons: [
            {
              title: "Старт",
              payload: {},
              url: ""
            }
          ],
          end_session: false
        },
        session: pick(
          ["session_id", "message_id", "user_id"],
          req.body.session
        ),
        version: req.body.version
      });
    } else {
      if (word.indexOf(req.body.request["command"]) > -1)
        res.json(createEchoResponse.youGuessed(req.body));
      else {
        res.json(createEchoResponse.youDidntGuess(req.body));
      }
    }
  } catch (err) {
    console.log("Ошибка ", err);
    res.status(500).send(err);
  }
});

server.listen(port, () => {
  console.log("Сервер запущен на http://localhost:" + port);
});
