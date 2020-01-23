const express = require('express');
const router = express.Router();

const Senior = require('../models/Senior');

router.get('/active', ensureAuthenticated, (req, res, next) => {

    var handlebarsData = {
        'NavBar': [
            {
                'Class': 'active',
                'Link': '/active',
                'Text': 'Active Meetings'
            },
            {
                'Link': '/active',
                'Text': 'Pending Meetings'
            },
            {
                'Link': '#',
                'Text': 'Pending'
            },
            {
                'Link': '#',
                'Text': 'Students'
            },
            {
                'Link': '#',
                'Text': 'Calendar'
            },
            {
                'Link': '#',
                'Text': 'Account'
            }
        ],
        'Title': 'Active Meetings',
        'TableHead': [
            'Name',
            'Department',
            'Location',
            'Topic',
            'Date DD/MM',
            'Edit'
        ]
    };

    Senior.findOne({ email: req.user.email }, (error, senior) => {
        if (error)
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        if (!senior)
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        var sideNav = {
            'FullName': senior.fullname,
            'Major': senior.major,
            'ClientCount': senior.clients.length,
            'Rating': '' + senior.Rating + '/10'
        };
        handlebarsData['SideNav'] = sideNav;
        
        var data = [[
            'Mustafa Kemal Özdemir',
            'Computer Engineering',
            'B212 Steel Building',
            'Life in Kayseri',
            '02/01 9:15'
        ], [
            'Emre Can Hacıosmanoğlu',
            'Computer Engineering',
            'BA12',
            'Life in Kayseri',
            '10/05 9:15'
        ]];
        handlebarsData['Table'] = data;

        return res.render('senior', handlebarsData);
    });

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