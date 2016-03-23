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
    aff: 'aff! :beers:',
    oan: 'oan :sob:'
  }
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
  	.then( res => res.json())
  	.then( json => json.currently.cloudCover)
    .then( cloudCover => bot.reply(message, cloudCover < 0.5 ? config.taps.aff : config.taps.oan) )

});

controller.hears(['frontier'], ['direct_message','direct_mention','mention','ambient'], (bot, message) => {

  // TODO - convo

  bot.reply(message, 'Want to know whether you can take ya tap aff?')

});
