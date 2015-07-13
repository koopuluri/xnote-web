
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var http = require('http');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// configuration ===============================================================
mongoose.connect('mongodb://koopuluri:whyisblue@ds045882.mongolab.com:45882/xnotelabs');
// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'poopispoop' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Set /static as our static content dir
app.use("/", express.static(__dirname + "/static"));

var io = null;

// middleware to pass on the io:
app.use(function(req, res, next) {
    req.io = io;
    next();
});



// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./config/passport')(passport); // pass passport for configuration

// launch ======================================================================
var server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
    io = require('socket.io').listen(this);
});
