const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('senior', { data: 'This is a page for senior students who are looking for students to share information!' });
});

module.exports = router;