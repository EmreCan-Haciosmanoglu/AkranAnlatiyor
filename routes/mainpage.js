const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Senior = require('../models/Senior');

router.get('/', ensureAuthenticated, (req, res) => {
    User.findOne({username : req.username}, (error,user)=>{
        if (error)
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        Senior.findOne({email:user.email}, (error, senior)=>{
            if (error)
                return res.redirect('/login?Error=' + encodeURIComponent(error));
            if(senior)
                return res.redirect('/senior');
            return res.render('freshman', { data: 'This is a page for freshman students who are seeking for information!' });
        }) ;
    });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login?Success=' + encodeURIComponent('Successfully Logged out!'));
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    return res.redirect('/login'
        + '?Redirect=' + encodeURIComponent(fullUrl)
    );
}
module.exports = router;