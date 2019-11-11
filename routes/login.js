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
  const { Success, Error, Redirect, Username} = req.query;

  var handlebarsData = {
    'LoginTitle': 'Student Login',
    'btnLogin': 'Login',
    'Forgot': 'Forgot username or password?',
    'NoAccount': 'Don\'t have an account?',
    'PlaceholderUsername': 'Username',
    'PlaceholderPassword': 'Password'
  };

  if (Success && Success != "")
    handlebarsData['Success'] = decodeURIComponent(Success);
  if (Error && Error != "")
    handlebarsData['Error'] = decodeURIComponent(Error);
  if (Redirect && Redirect != "")
    handlebarsData['Redirect'] = decodeURIComponent(Redirect);
  if (Username)
    handlebarsData['Username'] = decodeURIComponent(Username);

  return res.render('login', handlebarsData);
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.redirect(
        '/login?Error=' + encodeURIComponent('Invalid username or password') +
        (req.body.username ? '&Username=' + encodeURIComponent(req.body.username) : '')
      );
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      if (req.body.Redirect)
        return res.redirect('' + req.body.Redirect+ '?Success=' + encodeURIComponent('You have successfully logged in!'));
      else
        return res.redirect('/?Success=' + encodeURIComponent('You have successfully logged in!'));
    });
  })(req, res, next);
});

function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated())
    return next();

  return res.redirect('/');
}

module.exports = router;