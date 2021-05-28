const { pick } = require("ramda");

let word = "";
let hideWord = "";
let arrWord = [];
let attempts = 0;
let id_image = 457239045; //картинка проигрыша
let count;
let places;
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
  choiceAnswer: function (req) {
    if (req.session.new) {
      return this.clientStart(req);
    } else {
      if (attempts == 0) {
        if (req.request.command == "нет" || req.request.command == "on_interrupt")
          return this.clientStop(req);
        else {
          hideWord = "";
          attempts = 9; //кол-во попыток
          return this.newWord(req);
        }
      }
      if (attempts >= 1) {
        if (word.indexOf(req.request["command"]) > -1) {
          count = 0;
          let place = [];
          for (let i = 0; i < arrWord.length; i++) {
            if (req.request.command == arrWord[i]) {
              hideWord = hideWord.substr(0, i) + req.request.command + hideWord.substr(i + 1);
              place.push(i + 1); //записываем положение буквы
              count++;
            }
          }
          if (hideWord == word) {
            attempts = 0;
            return this.clientWon(req);
          } else {
            if (place.length > 1) { //если букв несколько, то перечисляем
              places = place[0]
              for (let i = 1; i < place.length; i++) {
                places += ' и ' + place[i]
              }
            } else {
              places = place[0]
            }
            return this.correctAnswer(req, { hideWord, count, places })
          }
        } else {
          attempts--;
          if (attempts == 0)
            return this.clientLost(req); else
            id_image = id_image - attempts;
          return this.wrongAnswer(req)
        }
      }
    }
  },
  clientStart: function ({ request, session, version }) {
    return {
      response: {
        text:
          ["Привет! Давайте сыграем в виселицу. Попробуйте отгадать мое слово по буквам! Но помните: у вас всего девять попыток. Начнем?"],
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
          ["Я загадала слово из " + word.length + " букв. Буква?", newHideWord(word)],
        tts:
          "Я загадала слово из " + word.length + " букв! ^Буква^?",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  correctAnswer: function ({ request, session, version }, { hideWord, count, place }) {
    const yes = arrayRandElement(["Да!", "Верно!", "Угадали!", "Точно!", "В точку!", "Правильно!", "В яблочко!", "Есть такое!"])
    return {
      response: {
        text: [`${yes} Эта буква встречается ${count} раз` + pluralizeRus(count, ['', 'а', '']) + ". Это " + places + " буква.", hideWord],
        tts: `<speaker audio=\"marusia-sounds/game-ping-1\"> ${yes} Эта буква встречается ${count} раз` + pluralizeRus(count, ['', 'а', '']) + ". Это " + places + " буква.",
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  wrongAnswer: function ({ request, session, version }) {
    //<speaker audio=\"marusia-sounds/things-construction-1\">  когда создают балки 
    const no = arrayRandElement(["Не угадали!", "Неверно!", "Нет!", "Неправильно!", "Мимо!", "Такой буквы тут нет.", "Увы, нет.", "Промах."])
    return {
      response: {
        text: `${no} У вас осталось ${attempts} попыт` + pluralizeRus(attempts, ['ка', 'ки', 'ок']) + ".",
        tts: `${no} <speaker audio=\"marusia-sounds/game-loss-3\"> У вас осталось ${attempts} попыт` + pluralizeRus(attempts, ['ка', 'ки', 'ок']) + ".",
        // card: {
        //   type: "BigImage",
        //   image_id: id_image
        // },
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  clientLost: function ({ request, session, version }) {
    return {
      response: {
        text:
          "Вы проиграли. Не расстраивайтесь, в следующий раз точно повезет! Поиграем еще?",
        tts:
          "<speaker audio=\"marusia-sounds/human-laugh-3\"><s>Вы проиграли.</s> Не расстраивайтесь, в следующий раз точно повезет! <break time='1000ms'/> Поиграем ещ`ё?",
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
  clientWon: function ({ request, session, version }) {
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
  clientStop: function ({ request, session, version }) {
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
