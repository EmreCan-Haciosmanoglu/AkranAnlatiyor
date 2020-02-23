const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calenderShema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hours: [
        {
            hour: {
                type: String,
                required: true,
                unique: true
            },
            days: [
                {
                    type: Number,
                    required: true
                }
            ]
        }
    ]
});
module.exports = mongoose.model('calender', calenderShema);