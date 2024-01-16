const mongoose = require('mongoose');
const mailSender = require('./../utils/mailSender'); 

BallotSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    hasBalloted: {
        type: Boolean,
        default: false
    },
    rank: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    }
});

BallotSchema.pre("save", async function (next) {
    await mailSender('kumjude09@gmail.com',
                        'Ballot Update',
                        `<h2>Your rank is ${this.rank}</h2>`
    );


    next();
});

module.exports = mongoose.model('Ballot', BallotSchema);