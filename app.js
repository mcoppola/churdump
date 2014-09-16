var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js');

// Our openshift variables
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// Load express configuration
require(__dirname + '/config/env.js')(express, app);

// Load routes
require(__dirname + '/routes')(app);

// Start the server
http.createServer(app).listen(process.env.PORT || opts.port, function () {
    console.log("~ CHRDUMPLIN ~ : server listening on port %d in %s mode",
                opts.port, app.settings.env);
});
