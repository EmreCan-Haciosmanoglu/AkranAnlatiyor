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
    const { Error, Success } = req.query;

    var handlebarsData = {
        'ForgotTitle': 'Forgot Password?',
        'PlaceholderEmail': 'Email',
        'btnForgot': 'Send',
        'BackToLogin': 'Go To Login Page',
    };

    if (Success && Success != "")
        handlebarsData['Success'] = decodeURIComponent(Success);
    if (Error && Error != "")
        handlebarsData['Error'] = decodeURIComponent(Error);

    return res.render('forgot', handlebarsData);
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {
    const email = req.body.email;
    Link.findOne({ email: email, isReseted: false }, (error, link) => {
        if (error)
            return res.redirect('/forgot?Error=' + encodeURIComponent(error));
        if (link)
            return res.redirect('/login?Error=' + encodeURIComponent('You already requested a reset. Please check your mailbox!'));

        User.findOne({ email: email }, (err, user) => {
            if (err)
                return res.redirect('/forgot?Error=' + encodeURIComponent(error));
            if (!user)
                return res.redirect('/forgot?Error=' + encodeURIComponent('Email couldn\'t found!'));

            const pin = (Number)(Math.floor(Math.random() * 8999 + 1000));
            bcrypt.hash('' + Date.now() + '' + SecretKey.Key + '' + pin + '' + email, 10).then((token) => {
                link = new Link({
                    email: email,
                    token: token,
                    pin: pin,
                    isReseted: false
                });

                link.save().then(async (data) => {
                    if (data) {

                        const htmlBody = 'This is your link and pin to reset your password\n www.akrananlatiyor.com/reset?Token=' + encodeURIComponent(token) + ' \nPIN: ' + pin;

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
                        return res.redirect('/forgot?Success=' + encodeURIComponent('Check your mailbox!'));
                    }
                }).catch((error) => {
                    console.error(error);
                    return res.redirect('/forgot?Error=' + encodeURIComponent(error));
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