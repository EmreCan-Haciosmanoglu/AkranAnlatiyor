const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {
    return res.render('senior', { data: 'This is a page for senior students who are looking for students to share information!' });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    return res.redirect('/login'
        + '?Error=' + encodeURIComponent('You have to Login to see the page')
        + '&Redirect=' + encodeURIComponent(fullUrl)
    );
}

module.exports = router;