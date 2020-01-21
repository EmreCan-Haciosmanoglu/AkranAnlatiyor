const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {

    var handlebarsData = {
        'SideNav': {
            'FullName': 'Mustafa Kemal Özdemir',
            'Major': 'Computer Engineering',
            'ClientCount': '5 Akran',
            'Rating': '1.5/10'
        },
        'NavBar': [
            {
                'Class': 'active',
                'Link': '/',
                'Text': 'Active Meetings'
            },
            {
                'Link': '/',
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
    var data = [[
        'Mustafa Kemal Özdemir',
        'Computer Engineering',
        'B212 Steel Building',
        'Life in Kayseri',
        '02/01 9:15'
    ],[
        'Emre Can Hacıosmanoğlu',
        'Computer Engineering',
        'BA12',
        'Life in Kayseri',
        '10/05 9:15'
    ]];
    handlebarsData['Table'] = data;
    return res.render('senior', handlebarsData);
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