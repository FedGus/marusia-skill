const { pick } = require('ramda')

module.exports = ({ request, session, version }) => ({
  response: {
    text: "Угадали! Эта буква встречается " + 2 + " раза",
    tts: "Угадали! Эта буква встречается " + 2 + " раза",
    end_session: false,
  },
  session: pick(['session_id', 'message_id', 'user_id'], session),
  version,
})