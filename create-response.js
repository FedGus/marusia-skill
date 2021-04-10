const { pick } = require("ramda");

let word = "";
let attempts = 2;
var arr = ['сообщение', 'колодец', 'праздник', 'картинка', 'троллейбус', 'каравай', 'поступок'];

function arrayRandElement(arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}

function pluralizeRus(n, forms) {
  return n % 10 == 1 && n % 100 != 11
    ? forms[0]
    : (n % 10 >= 2 && n % 10 <= 4
      && (n % 100 < 10
        || n % 100 >= 20) ? forms[1] : forms[2]);
}

function pattern(word) {
  let pattern = "";
  for (let i = 1; i < word.length; i++) {
    pattern += " _ ";
  }
  return pattern;
}




module.exports = {
  loose: function ({ request, session, version }) {
    if (attempts <= 0) {
      return this.youResult({ request, session, version })
    } else {
      if (word.indexOf(request["command"]) > -1) {
        return this.youGuessed({ request, session, version })
      } else {
        attempts--;
        return this.youDidntGuessed({ request, session, version })
      }
    }
  },
  youStart: function ({ request, session, version }) {
    return {
      response: {
        text:
          "Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но помните: у вас всего девять попыток. ",
        tts:
          "Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но ^помните^, у вас всего девять попыток! ^Начнем^?",
        buttons: [
          {
            title: "Да!",
            payload: {},
            url: "",
          },
          {
            title: "Нет",
            payload: { command: "on_interrupt" },
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
    word = arrayRandElement(arr);
    return {
      response: {
        text:
          ["Я загадала слово из "+ word.length + " букв! Буква?", pattern(word)],
        tts:
        "Я загадала слово из "+ word.length + " букв! ^Буква^?",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  youGuessed: function ({ request, session, version }) {
    return {
      response: {
        text: "Угадали! Эта буква встречается " + 2 + " раза." + word,
        tts: "<speaker audio=\"marusia-sounds/game-ping-1\"> Угадали! Эта буква встречается " + 2 + " раза.",
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  youDidntGuessed: function ({ request, session, version }) {
    return {
      response: {
        text: "Не угадали! У вас осталось " + attempts + " попыт" + pluralizeRus(attempts, ['ка', 'ки', 'ок']) + "." + word,
        tts: "<speaker audio=\"marusia-sounds/game-loss-3\"> Не угадали! У вас осталось " + attempts + " попыт" + pluralizeRus(attempts, ['ка', 'ки', 'ок']) + ".",
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  youResult: function ({ request, session, version }) {
    return {
      response: {
        text:
          "Вы проиграли. Не расстраивайтесь, в следующий раз точно повезет! Поиграем еще?",
        tts:
          "<s>Вы проиграли.</s> Не расстраивайтесь, в следующий раз точно повезет! <break time='1000ms'/> Поиграем ещ`ё?",
          buttons: [
        {
          title: "Да!",
          payload: {},
          url: "",
        },
        {
          title: "Нет",
          payload: { command: "on_interrupt" },
          url: ""
        }
      ],
        end_session: false
      },
      
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
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
