const mongoose = require('mongoose');
const uri = "mongodb+srv://EmreCan61:<password>@akrananlatiyor-17mqx.mongodb.net/test?retryWrites=true&w=majority";

module.exports = () => {
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

    mongoose.connection.on('open', () => {
        console.log('MongDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongDB: Error ' + err);
    });

    mongoose.Promise = global.Promise;

} 