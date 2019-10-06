const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Link = require('../models/PasswordReset');

router.get('/', ensureNotAuthenticated, (req, res, next) => {
    const token = req.query.Token;
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
            'BackToLogin': 'Go To Login Page'
        };
        return res.render('reset', handlebarsData);
    });
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {

});

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    return res.redirect('/home');
}

module.exports = router;