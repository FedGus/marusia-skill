const { pick } = require("ramda");
let attempts = 9;
var arr = ['сообщение', 'колодец', 'праздник', 'картинка', 'троллейбус', 'каравай', 'поступок'];
let word = "";


function pluralizeRus(n, forms) {
  return n % 10 == 1 && n % 100 != 11
    ? forms[0]
    : (n % 10 >= 2 && n % 10 <= 4
      && (n % 100 < 10
        || n % 100 >= 20) ? forms[1] : forms[2]);
}

function arrayRandElement(arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}

module.exports = {
  youStart: function ({ request, session, version }) {
    word = arrayRandElement(arr);
    return {
      response: {
        text:
          "Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но помните: у вас всего девять попыток. Начнем?",
        tts:
          "Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но ^помните^, у вас всего девять попыток! ^Начнем^?",
        buttons: [
          {
            title: "Да!",
            payload: {},
            url: ""
          },
          {
            title: "Нет",
            payload: { command: "on_interrupt"},
            url: ""
          }
        ],
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  newWord: function ({ request, session, version }) {
    return {
      response: {
        text:
          "Я загадала слово! Буква?" + word,
        tts:
          "Я загадала слово! ^Буква^?",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  youGuessed: function ({ request, session, version }) {
    if (word.indexOf(request["command"]) > -1)
      return {
        response: {
          text: "Угадали! Эта буква встречается " + 2 + " раза." + word,
          tts: "<speaker audio=\"marusia-sounds/game-ping-1\"> Угадали! Эта буква встречается " + 2 + " раза.",
          end_session: false
        },
        session: pick(["session_id", "message_id", "user_id"], session),
        version
      };
    else {
      attempts--;
      return {
        response: {
          text: "Не угадали! У вас осталось " + attempts + " попыт" + pluralizeRus(attempts, ['ка', 'ки', 'ок']) + "." + word,
          tts: "<speaker audio=\"marusia-sounds/game-loss-3\"> Не угадали! У вас осталось " + attempts + " попыт" + pluralizeRus(attempts, ['ка', 'ки', 'ок']) + ".",
          end_session: false
        },
        session: pick(["session_id", "message_id", "user_id"], session),
        version
      };
    }
  },
  youStop: function ({ request, session, version }) {
    return {
      response: {
        text:
          "Было приятно с вами поиграть! Возвращайтесь, когда будет удобно!",
        tts:
          "Было приятно с вами поиграть! Возвращайтесь, когда будет удобно!",
        end_session: true
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
};
