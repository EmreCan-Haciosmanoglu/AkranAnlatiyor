const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('register', {data: 'This page is for registration!'});
});
module.exports = router;