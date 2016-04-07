const bot = require('./bot');
const app = require('express')();

app.get('/', (req, res) => {
    res.send('Taps Aff!');
});

app.listen(1337);
