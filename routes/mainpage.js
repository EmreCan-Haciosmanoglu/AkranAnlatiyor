const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {
    var num = Math.random(Math.random());
    if (num == 1)
        return res.render('freshman', { data: 'This is a page for freshman students who are seeking for information!' });
    else
        return res.render('senior', { data: 'This is a page for senior students who are looking for students to share information!' });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    return res.redirect('/login'
        + '?LoginError=' + encodeURIComponent('You have to Login to see the page')
        + '&Redirect=' + encodeURIComponent(fullUrl)
    );
}
module.exports = router;