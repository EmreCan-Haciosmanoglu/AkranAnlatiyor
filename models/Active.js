const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeShema = new Schema({
    seniorEmail: {
        type: String,
        required: true,
        unique: true
    },
    freshmanEmail: {
        type: String,
        required: true,
        unique: true
    },
    freshmanMajor: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('active', activeShema);