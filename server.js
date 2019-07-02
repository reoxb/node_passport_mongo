// set up ======================================================================
var express = require('express');
var mongoose = require('mongoose'); 				// mongoose for mongodb
var database = require('./config/database.js'); 			// load the database config
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//variables del servidor
const port = process.env.PORT || 3000;
const hostname = 'localhost';

// set up database for express session
// var MongoStore = require('connect-mongo')(expressSession);

// Connect to DB
mongoose.connect(database.localUrl,
  function(err, res) {
    if(err) throw err;
    console.log('Conectado con éxito a la BD');
});

var app = express(); 						// create our app w/ express

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash())

var initPassport = require('./passport/init');
initPassport(passport);

// routes ======================================================================
var routes = require('./routes/index')(passport);
app.use('/', routes)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// listen (start app with node server.js) ======================================
app.listen(port, hostname, () =>
  console.log(`File server running at http://${hostname}:${port}/`)
);
