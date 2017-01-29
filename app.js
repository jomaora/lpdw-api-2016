var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var cors = require('cors')

var APIError = require('./lib/apiError');
var index = require('./routes/index');
var users = require('./routes/users');
var songs = require('./routes/songs');

var app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sess = {
    secret: 'social-music-api',
    cookie: {},
    resave: false,
    saveUninitialized: true
};
app.use(session(sess));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return next(new APIError(406, 'Not valid type for asked resource'));
    }
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/songs', songs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (req.accepts('text/html')) {
    return res.render('error');
  }
  res.send(res.locals.message);
});

module.exports = app;
