const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('forgot');
});

module.exports = router;