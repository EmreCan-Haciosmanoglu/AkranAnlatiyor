const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('admin', {data: 'This page is for admin!'});
});
module.exports = router;