var Botkit = require('botkit')
var fetch = require('node-fetch')

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const config = {
  coach: {
    lat: 51.513200,
    lng: -0.130254
  },
  taps: {
    aff: {
      message: 'aff!',
      emojis: ['beers', 'matman', 'sunny', 'russia']
    },
    oan: {
      message: 'oan',
      emojis: ['sob', 'rage1', 'china']
    }
  }
}

function generateBotReply (config) {
  var reply = config.message + ' ';
  var emojis = config.emojis;
  var emojiCount = 3 + Math.floor(11 * Math.random());

  for (var i = 0; i < emojiCount; i++) {
    var emojiIndex = Math.floor(emojis.length * Math.random());
    var emoji = emojis[emojiIndex];

    reply += `:${emoji}:`;
  }

  return reply;
}

const controller = Botkit.slackbot({
  debug: false
})

const bot = controller.spawn({
  token: process.env.token
})

bot.startRTM( (err, bot, payload) => {

  if (err) throw new Error('Could not connect to Slack')

});

controller.hears(['taps?'], ['direct_message','direct_mention','mention','ambient'], (bot, message) => {

  fetch(`https://api.forecast.io/forecast/${process.env.api}/${config.coach.lat},${config.coach.lng}`)
    .then(res => res.json())
    .then(json => json.currently.cloudCover)
    .then(cloudCover => {
      const tapsConfig = cloudCover < 0.5 ? config.taps.aff : config.taps.oan;
      const botReply = generateBotReply(tapsConfig);

      bot.reply(message, botReply)
    })

});

controller.hears(['frontier'], ['ambient'], (bot, message) => {

  bot.startConversation(message, askWhether);

});

askWhether = (response, convo) => {

  convo.ask('Want to know whether you can take ya tap aff?', (response, convo) => {
    convo.say('Bloody well type `taps?` then');
    convo.next();
  });

}
