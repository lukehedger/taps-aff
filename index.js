var bot = require('./bot');
var express = require('express'),
    app = express();

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.get('/', function (req, res) {
    res.send('tapsbot');
});

var server = app.listen(server_port, server_ip_address, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log( "Listening on http://" + host + ":" + port );
});
