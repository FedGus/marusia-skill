const { pick } = require("ramda");

let word = "";
let hideWord = "";
let arrWord = [];
let attempts = 9;
let count;
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

function newHideWord(word) {
  for (let i = 0; i < word.length; i++) {
    arrWord[i] = word.charAt(i)
    console.log(arrWord[i]);
    hideWord += "*";
  }
  return hideWord;
}

module.exports = {
  youVersion: function (req) {
    if (attempts <= 1) {
      hideWord = "";
      attempts = 9;
      return this.youLoose(req)
    } else if (hideWord == word) return this.youWin(req); else {
      if (word.indexOf(req.request["command"]) > -1) {
        count = 0;
        for (let i = 0; i < arrWord.length; i++) {
          if (req.request.command == arrWord[i]) {
            hideWord = hideWord.substr(0, i) + req.request.command + hideWord.substr(i + 1);
            count++;
          }
        }
        return this.youGuessed(req, { hideWord, count })
      } else {
        attempts--;
        return this.youDidntGuessed(req)
      }
    }
  },
  youStart: function ({ request, session, version }) {
    return {
      response: {
        text:
          ["Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но помните: у вас всего девять попыток. "],
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
            payload: {},
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
          ["Я загадала слово из " + word.length + " букв! Буква?", newHideWord(word)],
        tts:
          "Я загадала слово из " + word.length + " букв! ^Буква^?",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  youGuessed: function ({ request, session, version }, { hideWord, count }) {
    return {
      response: {
        text: ["Угадали! Эта буква встречается " + count + " раз" + pluralizeRus(count, ['', 'а', '']) + ".", hideWord],
        tts: "<speaker audio=\"marusia-sounds/game-ping-1\"> Угадали! Эта буква встречается " + count + " раз" + pluralizeRus(count, ['', 'а', '']) + ".",
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
  youLoose: function ({ request, session, version }) {
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
            payload: {},
            url: ""
          }
        ],
        end_session: false
      },

      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  youWin: function ({ request, session, version }) {
    return {
      response: {
        text:
          "Поздравляю, вы выиграли! Да, это слово '" + word + "'. Поиграем еще?",
        tts:
          "<s>Поздравляю, вы выиграли!</s> Да, это слово '" + word + "'. <break time='1000ms'/> Поиграем ещ`ё?",
        buttons: [
          {
            title: "Да!",
            payload: {},
            url: "",
          },
          {
            title: "Нет",
            payload: {},
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
