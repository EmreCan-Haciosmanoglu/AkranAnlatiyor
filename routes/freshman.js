const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('freshman', { data: 'This is a page for freshman students who are seeking for information!' });
});

module.exports = router;