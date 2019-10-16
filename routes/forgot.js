const express = require('express');
const router = express.Router();

router.get('/', ensureNotAuthenticated, (req, res, next) => {

    var handlebarsData = {
        'ForgotTitle': 'Forgot Password?',
        'PlaceholderEmail': 'Email',
        'btnForgot': 'Send',
        'BackToLogin': 'Go To Login Page',
    };
    return res.render('forgot', handlebarsData);
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {
    //check database for email

    //Create a token for reseting

    //send an email to that email
});

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    return res.redirect('/home');
}

module.exports = router;