const mongoose = require('mongoose');

MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telephone: {
        type: String,
        required: true
    },
    group: {
        type: [String],
        required: true,
    }
})

module.exports = mongoose.model('Member', MemberSchema);