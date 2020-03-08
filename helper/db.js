const mongoose = require('mongoose');
const Uri = require('./../private/Database');

module.exports = () => {
    mongoose.connect(Uri.uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

    mongoose.connection.on('open', () => {
        console.log('MongDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongDB: Error ' + err);
    });

    mongoose.Promise = global.Promise;
};