var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const db = require('./helper/db')();
const session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var flash = require('connect-flash');

var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var mainpageRouter = require('./routes/mainpage');
var registerRouter = require('./routes/register');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session
app.use(session({
  secret: 'SayMyName',
  saveUninitialized: true,
  resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//express-message
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', mainpageRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/register', registerRouter);
app.use('/administrator', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(Object.keys(err));
  console.log('\n'
    + '\n--------------------------------------------------'
    + '\n-----------------------Error----------------------'
    + '\n--------------------------------------------------\n'
    + err.message
    + '\n--------------------------------------------------\n'
    + err.stack
    + '\n--------------------------------------------------\n'
  );
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  if (err.status == 404)
    res.redirect('/404');
  else
    res.render('error');
});
module.exports = app;
