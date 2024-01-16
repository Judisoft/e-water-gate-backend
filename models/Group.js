const mongoose = require('mongoose');

GroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    admin: {
        type: [String],
        required: true,
        trim: true 
    },
    created_at: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Group', GroupSchema);