const { pick } = require("ramda");

module.exports = {
  youGuessed: function ({ request, session, version }) {
    return {
      response: {
        text: "Угадали! Эта буква встречается " + 2 + " раза",
        tts: "Угадали! Эта буква встречается " + 2 + " раза",
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  youDidntGuess: function ({ request, session, version }) {
    return {
      response: {
        text: "Не угадали! У вас осталась " + 1 + " попытка",
        tts: "Не угадали! У вас осталась " + 1 + " попытка",
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  }
};
