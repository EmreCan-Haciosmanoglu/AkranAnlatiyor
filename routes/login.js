const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res, next) => {
    return res.render('login', {data: 'This page is for loging in!'});
});

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

router.post('/', passport.authenticate('local', { failureRedirect: "/login", failureFlash: "Invalid username or password" }), (req, res) => {
  if (req.body.Redirect)
    return res.redirect('' + req.body.Redirect);
  else
    return res.redirect('/');
});

module.exports = router;