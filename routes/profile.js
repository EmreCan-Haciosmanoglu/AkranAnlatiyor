const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('error404', {data: 'This page is for people to see their profile!'});
});
module.exports = router;