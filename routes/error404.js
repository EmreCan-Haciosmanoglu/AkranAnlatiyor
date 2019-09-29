const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('error404', {data: '404 Not Found!'});
});

module.exports = router;