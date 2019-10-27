const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Link = require('../models/PasswordReset');

router.get('/', ensureNotAuthenticated, (req, res, next) => {
    const token = decodeURIComponent(req.query.Token);
    if (!token || token == "")
        return res.redirect('/login');

    Link.getLinkByToken(token, (err, link) => {
        if (err)
            return res.redirect('/login');
        if (!link)
            return res.redirect('/login');

        var handlebarsData = {
            'ResetTitle': 'Reset Password',
            'PlaceholderPassword': 'New Password',
            'PlaceholderConfirmPassword': 'Confirm New Password',
            'PlaceholderPIN': 'Enter PIN',
            'btnReset': 'Reset',
            'BackToLogin': 'Go To Login Page',
            'Token': token
        };
        return res.render('reset', handlebarsData);
    });
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {
    const token = req.body.Token;
    if (!token || token == "")
        return res.redirect('/login');

    Link.getLinkByToken(token, (err, link) => {
        if (err)
            return res.redirect('/login');
        if (!link)
            return res.redirect('/login');

        const {
            password1,
            password2,
            PIN
        } = req.body;

        req.checkBody("PIN", "PIN is required").notEmpty();
        req.checkBody("password1", "Password is required").notEmpty();
        req.checkBody("password2", "Passwords do not match").equals(req.body.password1);

        var errors = req.validationErrors();
        if (errors && errors.length > 0)
            return res.redirect('/register'
                + '?Error=' + encodeURIComponent(errors[0].msg)
                + '&Token=' + encodeURIComponent(token)
            );
        Link.findOne({ token: token, pin: PIN }, (err, result) => {
            if (err) 
                return res.redirect('/login');
            if (!result) 
                return res.redirect('/login');
            if (result.isReseted)
                return res.redirect('/login');
            bcrypt.hash(password1, 10).then((passwordHash) => {
                User.findOne({ email: result.email }, (err, user) => {
                    user.password = passwordHash;
                    user.save();
                    result.isReseted = true;
                    result.save();
                });
            });
        });
    });
});

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    return res.redirect('/home');
}

module.exports = router;