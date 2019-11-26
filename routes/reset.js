const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Link = require('../models/PasswordReset');

router.get('/', ensureNotAuthenticated, (req, res, next) => {
    const { Error } = req.query;
    
    if (!req.query.Token || req.query.Token == "")
    return res.redirect('/login?Error=' + encodeURIComponent('No token is provided!'));
    
    const token = decodeURIComponent(req.query.Token);

    Link.getLinkByToken(token, (error, link) => {
        if (error)
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        if (!link)
            return res.redirect('/login?Error=' + encodeURIComponent('Unvalid token!'));

        var handlebarsData = {
            'ResetTitle': 'Reset Password',
            'PlaceholderPassword': 'New Password',
            'PlaceholderConfirmPassword': 'Confirm New Password',
            'PlaceholderPIN': 'Enter PIN',
            'btnReset': 'Reset',
            'BackToLogin': 'Go To Login Page',
            'Token': token
        };

        if (Error && Error != "")
            handlebarsData['Error'] = decodeURIComponent(Error);

        return res.render('reset', handlebarsData);
    });
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {
    const token = req.body.Token;
    if (!token || token == "")
        return res.redirect('/login?Error=' + encodeURIComponent('No token is provided!'));

    Link.getLinkByToken(token, (err, link) => {
        if (error)
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        if (!link)
            return res.redirect('/login?Error=' + encodeURIComponent('Unvalid token!'));

        const {
            password1,
            PIN
        } = req.body;

        req.checkBody("PIN", "PIN is required").notEmpty();
        req.checkBody("password1", "Password is required").notEmpty();
        req.checkBody("password2", "Passwords do not match").equals(password1);

        var errors = req.validationErrors();
        if (errors && errors.length > 0)
            return res.redirect('/reset'
                + '?Error=' + encodeURIComponent(errors[0].msg)
                + '&Token=' + encodeURIComponent(token)
            );
        Link.findOne({ token: token, pin: PIN }, (err, result) => {
            if (error)
                return res.redirect('/login?Error=' + encodeURIComponent(error));
            if (!result)
                return res.redirect('/login?Error=' + encodeURIComponent('Unvalid token!'));
            if (result.isReseted)
                return res.redirect('/login?Error=' + encodeURIComponent('Already resetted! Get new link!'));

            bcrypt.hash(password1, 10).then((passwordHash) => {
                User.findOne({ email: result.email }, (err, user) => {
                    user.password = passwordHash;
                    user.save();
                    result.isReseted = true;
                    result.save();
                    return res.redirect('/login?Success=' + encodeURIComponent('Password is resetted successfully!'));
                });
            });
        });
    });
});

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    return res.redirect('/');
}

module.exports = router;