const express = require('express');
const router = express.Router();

const Senior = require('../models/Senior');
router.get('/', (req, res, next) => {
    return res.redirect('/senior/active');
});

router.get('/active', ensureAuthenticated, (req, res, next) => {

    var handlebarsData = {
        'NavBar': [
            {
                'Link': '/senior/active',
                'Text': 'Active Meetings'
            },
            {
                'Link': '/senior/pending',
                'Text': 'Pending Meetings'
            },
            {
                'Link': '#',
                'Text': 'Pending'
            },
            {
                'Link': '#',
                'Text': 'Students',
                'Icon': 'fa fa-users'
            },
            {
                'Link': '#',
                'Text': 'Calendar',
                'Icon': 'fa fa-calendar-check-o'
            },
            {
                'Link': '#',
                'Text': 'Account',
                'Icon': 'fa fa-user'
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
    handlebarsData['NavBar'][0]['Class'] = 'active';
    Senior.findOne({ email: req.user.email }, (error, senior) => {
        if (error)
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        if (!senior)
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        var sideNav = {
            'FullName': senior.fullname,
            'Major': senior.major,
            'ClientCount': senior.clients.length,
            'Rating': '' + senior.rating + '/10'
        };
        handlebarsData['SideNav'] = sideNav;

        
        var data = [
            {
                'data': [
                    'Mustafa Kemal Özdemir',
                    'Computer Engineering',
                    'B212 Steel Building',
                    'Life in Kayseri',
                    '02/01 9:15'
                ],
                'Cancel':'Cancel'
            },
            {
                'data': [
                    'Emre Can Hacıosmanoğlu',
                    'Computer Engineering',
                    'BA12',
                    'Life in Kayseri',
                    '10/05 9:15'
                ],
                'Cancel':'Cancel'
            }];

        handlebarsData['Table'] = data;

        return res.render('senior', handlebarsData);
    });
});

router.get('/pending', ensureAuthenticated, (req, res, next) => {

    var handlebarsData = {
        'NavBar': [
            {
                'Link': '/senior/active',
                'Text': 'Active Meetings'
            },
            {
                'Link': '/senior/pending',
                'Text': 'Pending Meetings'
            },
            {
                'Link': '#',
                'Text': 'Pending'
            },
            {
                'Link': '#',
                'Text': 'Students',
                'Icon': 'fa fa-users'
            },
            {
                'Link': '#',
                'Text': 'Calendar',
                'Icon': 'fa fa-calendar-check-o'
            },
            {
                'Link': '#',
                'Text': 'Account',
                'Icon': 'fa fa-user'
            }
        ],
        'Title': 'Pending Meetings',
        'TableHead': [
            'Name',
            'Department',
            'Location',
            'Topic',
            'Date DD/MM',
            'Action'
        ],
        'Modal':true
    };
    handlebarsData['NavBar'][1]['Class'] = 'active';
    Senior.findOne({ email: req.user.email }, (error, senior) => {
        if (error)
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        if (!senior)
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        var sideNav = {
            'FullName': senior.fullname,
            'Major': senior.major,
            'ClientCount': senior.clients.length,
            'Rating': '' + senior.rating + '/10'
        };
        handlebarsData['SideNav'] = sideNav;

        var data = [
            {
                'data': [
                    'Mustafa Kemal Özdemir',
                    'Computer Engineering',
                    'B212 Steel Building',
                    'Life in Kayseri',
                    '02/01 9:15'
                ],
                'Accept':'Accept'
            },
            {
                'data': [
                    'Emre Can Hacıosmanoğlu',
                    'Computer Engineering',
                    'BA12',
                    'Life in Kayseri',
                    '10/05 9:15'
                ],
                'Accept':'Accept'
            }];
        handlebarsData['Table'] = data;

        return res.render('senior', handlebarsData);
    });
});

router.get('/add', (req, res, next) => {
    const senior = new Senior({
        email: 'emre.can.haciosmanoglu@hotmail.com',
        fullname: 'Emre Can Hacıosmanoğlu',
        major: 'Computer Engineering',
        clients: [
            { email: 'x@x.com' },
            { email: 'x@x.com' }
        ],
        rating: 10
    });
    senior.save().then((data) => res.redirect('/senior/active'))
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