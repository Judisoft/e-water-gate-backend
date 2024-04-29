const Ballot = require("../models/Ballot");
const Member = require("../models/Member");

exports.getUserBallotStatus = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "User's Ballot Status",
    });
  } catch (error) {
    return console.log(error);
  }
};

exports.getAllBallots = async (req, res) => {
  try {
    const ballots = await Ballot.find({});
    return res.status(200).json({
      success: true,
      ballots,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Operation failed! Try again",
    });
  }
};

exports.createBallot = async (req, res) => {
  try {
    const { userName, hasBalloted, rank, memberEmail, group } = req.body;
    if (!userName || !hasBalloted || !rank || !memberEmail || !group) {
      return res.status(400).json({
        success: false,
        message:
          "userName, hasBalloted, rank, memberEmail, and group are required fields",
      });
    }

    // Check if the user has already balloted for the group
    const existingBallot = await Ballot.findOne({ memberEmail, group });
    if (existingBallot) {
      return res.status(409).json({
        success: false,
        message:
          "You have already balloted in this group. You can only ballot once!",
      });
    }

    // Create a new ballot
    const newBallot = await Ballot.create({
      userName,
      hasBalloted,
      rank,
      memberEmail,
      group,
    });

    return res.status(200).json({
      success: true,
      ballot: newBallot,
      message: `Ballot recorded! Your rank is ${rank}`,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

exports.getRanks = async (req, res) => {
  try {
    const { group } = req.body;
    const ballotList = await Ballot.find({ group });
    if (ballotList) {
      return res.status(200).json({
        success: true,
        ballotList,
        message: "Ranks fetched successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        ballotList,
        message: "No member has balloted yet",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};
