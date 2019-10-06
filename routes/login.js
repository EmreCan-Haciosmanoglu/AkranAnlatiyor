const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});
passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return done(null, false, { message: "Unknown user" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      else return done(null, false, "Invalid Password");
    });
  });
}));

router.get('/', ensureNotAuthenticated, (req, res, next) => {
  var handlebarsData = {
    'LoginTitle': 'Student Login',
    'btnLogin': 'Login',
    'Forgot': 'Forgot username or password?',
    'NoAccount': 'Don\'t have an account?',
    'PlaceholderUsername': 'Username',
    'PlaceholderPassword': 'Password'
  };

  if (req.query.LoginError && req.query.LoginError != "")
    handlebarsData['LoginError'] = decodeURIComponent(req.query.LoginError);
  if (req.query.Redirect && req.query.Redirect != "")
    handlebarsData['Redirect'] = decodeURIComponent(req.query.Redirect);
  if (req.query.Username)
    handlebarsData['Username'] = decodeURIComponent(req.query.Username);
  if (req.query.Password)
    handlebarsData['Password'] = decodeURIComponent(req.query.Password);

  return res.render('login', handlebarsData);
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.redirect(
        '/login?LoginError=' + encodeURIComponent('Invalid username or password') +
        (req.body.username ? '&Username=' + encodeURIComponent(req.body.username) : '') +
        (req.body.password ? '&Password=' + encodeURIComponent(req.body.password) : '')
      );
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      if (req.body.Redirect)
        return res.redirect('' + req.body.Redirect);
      else
        return res.redirect('/');
    });
  })(req, res, next);
});

function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated())
    return next();

  return res.redirect('/home');
}

module.exports = router;