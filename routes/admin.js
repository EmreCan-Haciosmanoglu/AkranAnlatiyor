const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {
    return res.render('admin', {data: 'This page is for admin!'});
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