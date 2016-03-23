import Botkit from 'botkit'
import fetch from 'node-fetch'

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

  const { coach, taps } = config;

  fetch(`https://api.forecast.io/forecast/${process.env.api}/${coach.lat},${coach.lng}`)
  	.then( res => res.json())
  	.then( json => json.currently.cloudCover)
    .then( cloudCover => bot.reply(message, cloudCover < 0.5 ? taps.aff : taps.oan) )

});
