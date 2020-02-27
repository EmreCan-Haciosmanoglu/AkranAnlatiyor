const express = require('express');
const router = express.Router();

const Senior = require('../models/Senior');
const Active = require('../models/Active');
const Pending = require('../models/Pending');
const History = require('../models/History');
const Calender = require('../models/Calender');

router.get('/', ensureAuthenticated, (req, res, next) => {
    Senior.findOne({ email: req.user.email }, (error, senior) => {
        if (error) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent(error));
        }
        if (!senior) {
            req.logOut();
            return res.redirect('/login?Error=' + encodeURIComponent('Unauthorized access!'));
        }
        Calender.findOne({ email: senior.email }, (error, calender) => {
            if (error) {
                req.logOut();
                return res.redirect('/login?Error=' + encodeURIComponent(error));
            }
            if (calender)
                return res.redirect('/senior/active');

            const calender = new Calender({
                email: senior.email,
                days: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday'
                ],
                hours: [
                    {
                        hour: '08:00 - 09:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '09:00 - 10:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '10:00 - 11:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '11:00 - 12:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '12:00 - 13:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '13:00 - 14:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '14:00 - 15:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '15:00 - 16:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '16:00 - 17:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '17:00 - 18:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '18:00 - 19:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    },
                    {
                        hour: '19:00 - 20:00',
                        days: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
                    }
                ]
            });
            calender.save().then((data) => res.redirect('/senior/active'))
        });
    });
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
            console.table(calender.hours[0].days)
            handlebarsData['Calender'] = calender.hours;
            handlebarsData['Days'] = calender.days;

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

router.get('/addCalender', (req, res, next) => {
    const calender = new Calender({
        email: 'emre.can.haciosmanoglu@hotmail.com',
        days: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
        ],
        hours: [
            {
                hour: '9:00',
                days: [
                    {
                        value: 0
                    },
                    {
                        value: 0
                    },
                    {
                        value: 0
                    },
                    {
                        value: 0
                    },
                    {
                        value: 0
                    }
                ]
            }
        ]
    });
    calender.save().then((data) => res.redirect('/senior/active'))
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