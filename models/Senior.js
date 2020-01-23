const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seniorShema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    clients: [
        {
            email: {
                type: String,
                required: true
            }
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('senior', seniorShema);