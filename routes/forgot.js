const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const SecretKey = require('./../private/SecretKey');
const Passwords = require('./../private/Passwords');

const User = require('../models/User');
const Link = require('../models/PasswordReset');

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
    const email = req.body.email;
    Link.findOne({ email: email, isReseted: false }, (err, link) => {
        if (err)
            console.log(err);
        if (link)
            return res.redirect('/forgot');

        User.findOne({ email: email }, (err, user) => {
            if (err)
                console.log(err);
            if (!user)
                return res.redirect('/forgot');

            const pin = Math.floor(Math.random() * 1000 + 1000);
            bcrypt.hash('' + Date.now() + '' + SecretKey.Key + '' + pin + '' + email, 10).then((token) => {
                link = new Link({
                    email: email,
                    token: token,
                    pin: pin,
                    isReseted: false
                });

                link.save().then(async (data) => {
                    if (data) {

                        const htmlBody = 'This is your link and pin to reset your password\n www.akrananlatiyor.com/reset?Token=' + token + ' \nPIN: ' + pin;

                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 587,
                            auth: {
                                user: 'AkranAnlatiyor@gmail.com',
                                pass: Passwords.password
                            }
                        });

                        let info = await transporter.sendMail({
                            from: '"Support Team 👻" <AkranAnlatiyor@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: 'Password Reset', // Subject line
                            text: 'Did you forget already?', // plain text body
                            html: htmlBody // html body
                        });

                        console.log('Message sent: %s', info.messageId);
                        return res.redirect('/forgot');
                    }
                }).catch((error) => {
                    console.error(error);
                    return res.redirect('/forgot');
                });

            });
        });
    });
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