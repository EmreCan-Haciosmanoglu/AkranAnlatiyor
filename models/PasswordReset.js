const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const linkSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    pin: {
        type: Number,
        required: true
    },
    date: {
        type: Date, default: Date.now,
        required: true
    },
    isReseted: {
        type: Boolean,
        required: true
    }
});
var Link = module.exports = mongoose.model('link', linkSchema);

module.exports.getLinkByToken = (token, callback) => {
    var query = { token: token };
    User.findOne(query, callback);
};