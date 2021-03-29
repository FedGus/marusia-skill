const { pick } = require('ramda')

module.exports = ({ request, session, version}) => ({
  response: {
    text: "Привет, я твой первый навык на Node.js!",
    tts: "Привет, я твой первый навык на нод джээс!",
    end_session: false,
  },
  session: pick(['session_id', 'message_id', 'user_id'], session),
  version,
})