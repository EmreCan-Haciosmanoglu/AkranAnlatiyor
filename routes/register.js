const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.get('/', ensureNotAuthenticated, (req, res, next) => {
    return res.render('register',
        {
            'RegisterTitle': 'Student Register',
            'btnRegister': 'Register',
            'LinkToLoginText': 'Back to Login',
            'PlaceholderFirstName': 'First Name',
            'PlaceholderLastName': 'Last Name',
            'PlaceholderUsername': 'Username',
            'PlaceholderEmail': 'Email',
            'PlaceholderPassword': 'Password',
            'PlaceholderConfirmPassword': 'Confirm Password'
        });
});

router.post('/', ensureNotAuthenticated, (req, res, next) => {
    const {
        email,
        password1,
        firstname,
        lastname,
        username
    } = req.body;

    req.checkBody("firstname", "First name is required").notEmpty();
    req.checkBody("lastname", "Last name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("email", "E-mail is required").notEmpty();
    req.checkBody("email", "E-mail is not valid").isEmail();
    req.checkBody("password1", "Password is required").notEmpty();
    req.checkBody("password2", "Passwords do not match").equals(req.body.password1);

    var errors = req.validationErrors();
    if (errors && errors.length > 0)
        return res.redirect('/register'
            + '?RegisterError=' + encodeURIComponent(errors[0].msg)
            + ((firstname && firstname != "") ? '&firstname=' + encodeURIComponent(firstname) : '')
            + ((lastname && lastname != "") ? '&lastname=' + encodeURIComponent(lastname) : '')
            + ((username && username != "") ? '&username=' + encodeURIComponent(username) : '')
            + ((email && email != "") ? '&email=' + encodeURIComponent(email) : '')
        );

    User.findOne({ 'username': username }, (user) => {
        if (user) {
            return res.redirect('/register'
                + '?RegisterError=' + encodeURIComponent('Username is already taken')
                + ((firstname && firstname != "") ? '&firstname=' + encodeURIComponent(firstname) : '')
                + ((lastname && lastname != "") ? '&lastname=' + encodeURIComponent(lastname) : '')
                + ((email && email != "") ? '&email=' + encodeURIComponent(email) : '')
            );
        }
        User.findOne({ 'email': email }, (user) => {
            if (user) {
                return res.redirect('/register'
                    + '?RegisterError=' + encodeURIComponent('Email is already taken')
                    + ((firstname && firstname != "") ? '&firstname=' + encodeURIComponent(firstname) : '')
                    + ((lastname && lastname != "") ? '&lastname=' + encodeURIComponent(lastname) : '')
                    + ((username && username != "") ? '&username=' + encodeURIComponent(username) : '')
                );
            }
            bcrypt.hash(password1, 10).then((hash) => {
                const user = new User({
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    password: hash
                });

                user.save().then((data) => {
                    if (data)
                        return res.redirect('/login');
                }).catch((error) => {
                    console.error(error);
                    return res.redirect('/register');
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