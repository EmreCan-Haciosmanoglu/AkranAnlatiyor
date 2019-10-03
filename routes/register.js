const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.get('/', ensureNotAuthenticated, (req, res, next) => {
    var handlebarsData = {
        'RegisterTitle': 'Student Register',
        'btnRegister': 'Register',
        'LinkToLoginText': 'Back to Login',
        'PlaceholderFirstName': 'First Name',
        'PlaceholderLastName': 'Last Name',
        'PlaceholderUsername': 'Username',
        'PlaceholderEmail': 'Email',
        'PlaceholderPassword': 'Password',
        'PlaceholderConfirmPassword': 'Confirm Password'};

    if (req.query.RegisterError && req.query.RegisterError != "")
        handlebarsData['RegisterError'] = decodeURIComponent(req.query.RegisterError);
    if (req.query.Redirect && req.query.Redirect != "")
        handlebarsData['Redirect'] = decodeURIComponent(req.query.Redirect);
    if (req.query.firstname)
        handlebarsData['Firstname'] = decodeURIComponent(req.query.Firstname);
    if (req.query.lastname)
        handlebarsData['Lastname'] = decodeURIComponent(req.query.Lastname);
    if (req.query.username)
        handlebarsData['Username'] = decodeURIComponent(req.query.Username);
    if (req.query.email)
        handlebarsData['Email'] = decodeURIComponent(req.query.Email);

    return res.render('register', handlebarsData);
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
            + ((firstname && firstname != "") ? '&Firstname=' + encodeURIComponent(firstname) : '')
            + ((lastname && lastname != "") ? '&Lastname=' + encodeURIComponent(lastname) : '')
            + ((username && username != "") ? '&Username=' + encodeURIComponent(username) : '')
            + ((email && email != "") ? '&Email=' + encodeURIComponent(email) : '')
        );

    User.findOne({ 'username': username }, (user) => {
        if (user) {
            return res.redirect('/register'
                + '?RegisterError=' + encodeURIComponent('Username is already taken')
                + ((firstname && firstname != "") ? '&Firstname=' + encodeURIComponent(firstname) : '')
                + ((lastname && lastname != "") ? '&Lastname=' + encodeURIComponent(lastname) : '')
                + ((email && email != "") ? '&Email=' + encodeURIComponent(email) : '')
            );
        }
        User.findOne({ 'email': email }, (user) => {
            if (user) {
                return res.redirect('/register'
                    + '?RegisterError=' + encodeURIComponent('Email is already taken')
                    + ((firstname && firstname != "") ? '&Firstname=' + encodeURIComponent(firstname) : '')
                    + ((lastname && lastname != "") ? '&Lastname=' + encodeURIComponent(lastname) : '')
                    + ((username && username != "") ? '&Username=' + encodeURIComponent(username) : '')
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
                        return res.redirect('/login?Success=' + encodeURIComponent('You are successfully registered'));
                }).catch((error) => {
                    console.error(error);
                    return res.redirect('/register?RegisterError=' + encodeURIComponent(error));
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