const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    var num = Math.random(Math.random());
    if (num == 1)
        return res.render('freshman', { data: 'This is a page for freshman students who are seeking for information!' });
    else
        return res.render('senior', { data: 'This is a page for senior students who are looking for students to share information!' });
});
module.exports = router;