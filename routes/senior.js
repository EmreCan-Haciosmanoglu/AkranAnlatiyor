const express = require('express');
const router = express.Router();

const Senior = require('../models/Senior');
const Active = require('../models/Active');
const Pending = require('../models/Pending');
const History = require('../models/History');
const Calender = require('../models/Calender');

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
                'Link': '/senior/history',
                'Text': 'Meeting History'
            },
            {
                'Link': '#',
                'Text': 'Students',
                'Icon': 'fa fa-users'
            },
            {
                'Link': '/senior/calender',
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
        if (error) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        }
        if (!senior) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        }
        var sideNav = {
            'FullName': senior.fullname,
            'Major': senior.major,
            'ClientCount': senior.clients.length,
            'Rating': '' + senior.rating + '/10'
        };
        handlebarsData['SideNav'] = sideNav;

        Active.find({ seniorEmail: senior.email }, (error, actives) => {
            if (error) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent(error));
            }
            if (!actives) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent('Error'));
            }
            var data = [];

            actives.forEach((active) => {
                data.push({
                    'data': [
                        active.freshmanFullname,
                        active.freshmanMajor,
                        active.place,
                        active.topic,
                        active.date
                    ],
                    'Cancel': 'Cancel'
                });
            });

            handlebarsData['Table'] = data;

            return res.render('senior', handlebarsData);
        });
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
                'Link': '/senior/history',
                'Text': 'Meeting History'
            },
            {
                'Link': '#',
                'Text': 'Students',
                'Icon': 'fa fa-users'
            },
            {
                'Link': '/senior/calender',
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
        'Modal': true
    };
    handlebarsData['NavBar'][1]['Class'] = 'active';
    Senior.findOne({ email: req.user.email }, (error, senior) => {
        if (error) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        }
        if (!senior) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        }
        var sideNav = {
            'FullName': senior.fullname,
            'Major': senior.major,
            'ClientCount': senior.clients.length,
            'Rating': '' + senior.rating + '/10'
        };
        handlebarsData['SideNav'] = sideNav;

        Pending.find({ seniorEmail: senior.email }, (error, pendings) => {
            if (error) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent(error));
            }
            if (!pendings) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent('Error'));
            }
            var data = [];

            pendings.forEach((pending) => {
                data.push({
                    'data': [
                        pending.freshmanFullname,
                        pending.freshmanMajor,
                        pending.place,
                        pending.topic,
                        pending.date
                    ],
                    'Accept': 'Accept'
                });
            });

            handlebarsData['Table'] = data;
            return res.render('senior', handlebarsData);
        });
    });
});

router.get('/history', ensureAuthenticated, (req, res, next) => {

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
                'Link': '/senior/history',
                'Text': 'Meeting History'
            },
            {
                'Link': '#',
                'Text': 'Students',
                'Icon': 'fa fa-users'
            },
            {
                'Link': '/senior/calender',
                'Text': 'Calendar',
                'Icon': 'fa fa-calendar-check-o'
            },
            {
                'Link': '#',
                'Text': 'Account',
                'Icon': 'fa fa-user'
            }
        ],
        'Title': 'Meeting History',
        'TableHead': [
            'Name',
            'Department',
            'Location',
            'Topic',
            'Date DD/MM',
            'Comment'
        ],
        'Modal': true
    };
    handlebarsData['NavBar'][2]['Class'] = 'active';
    Senior.findOne({ email: req.user.email }, (error, senior) => {
        if (error) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        }
        if (!senior) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        }
        var sideNav = {
            'FullName': senior.fullname,
            'Major': senior.major,
            'ClientCount': senior.clients.length,
            'Rating': '' + senior.rating + '/10'
        };
        handlebarsData['SideNav'] = sideNav;

        History.find({ seniorEmail: senior.email }, (error, histories) => {
            if (error) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent(error));
            }
            if (!histories) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent('Error'));
            }
            var data = [];

            histories.forEach((history) => {
                data.push({
                    'data': [
                        history.freshmanFullname,
                        history.freshmanMajor,
                        history.place,
                        history.topic,
                        history.date
                    ],
                    'Comment': 'Comment'
                });
            });

            handlebarsData['Table'] = data;
            return res.render('senior', handlebarsData);
        });
    });
});

router.get('/calender', ensureAuthenticated, (req, res, next) => {
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
                'Link': '/senior/history',
                'Text': 'Meeting History'
            },
            {
                'Link': '#',
                'Text': 'Students',
                'Icon': 'fa fa-users'
            },
            {
                'Link': '/senior/calender',
                'Text': 'Calendar',
                'Icon': 'fa fa-calendar-check-o'
            },
            {
                'Link': '#',
                'Text': 'Account',
                'Icon': 'fa fa-user'
            }
        ],
        'Title': 'Calender',
        'TableHead': [
            'Name',
            'Department',
            'Location',
            'Topic',
            'Date DD/MM',
            'Comment'
        ]
    };
    handlebarsData['NavBar'][4]['Class'] = 'active';
    Senior.findOne({ email: req.user.email }, (error, senior) => {
        if (error) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        }
        if (!senior) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        }
        var sideNav = {
            'FullName': senior.fullname,
            'Major': senior.major,
            'ClientCount': senior.clients.length,
            'Rating': '' + senior.rating + '/10'
        };
        handlebarsData['SideNav'] = sideNav;

        Calender.findOne({ email: senior.email }, (error, calender) => {
            if (error) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent(error));
            }
            if (!calender) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent('Unfilled Calender!'));
            }

            handlebarsData['Calender'] = calender.hours;

            return res.render('calender', handlebarsData);
        });
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