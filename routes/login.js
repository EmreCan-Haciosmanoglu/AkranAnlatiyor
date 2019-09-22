const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('login', {data: 'This page is for loging in!'});
});
module.exports = router;