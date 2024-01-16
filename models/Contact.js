const mongoose = require('mongoose');

ContactSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Contact', ContactSchema);