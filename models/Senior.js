const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seniorShema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
module.exports = mongoose.model('senior', seniorShema);