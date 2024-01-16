const Ballot = require('../models/Ballot');

exports.getUserBallotStatus = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: 'User\'s Ballot Status'
        });
    } catch (error) {
        return console.log(error)
    }
}

exports.createBallot = async (req, res) => {
    try {
        const {userName, group, hasBalloted, rank} = req.body;
        if (!userName ||
            !group ||
            !hasBalloted ||
            !rank
        ) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }

        const existingUsers = await Ballot.find({userName});
        const hasExistingUser = existingUsers.some(existingUser => existingUser.group === group);
        if (hasExistingUser) {
            return res.status(409).json({
                success: false,
                message: 'This user has already balloted. You can ballot just once.'
            });
        }
        const ballot = await Ballot.create({userName, group, hasBalloted, rank});
        return res.status(200).json({
            success: true,
            ballot,
            message: `Ballot recorded! Your rank is ${rank}`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
};

exports.getRanks = async (req, res) => {
    try {
        const {group} = req.body;
        const ballotList = await Ballot.find({group})
        if(ballotList) {
            return res.status(200).json({
                success: true,
                ballotList,
                message: 'Ranks fetched successfully'
            });
        } else {
            return res.status(404).json({
                success: false,
                ballotList,
                message: 'No member has balloted yet'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
}