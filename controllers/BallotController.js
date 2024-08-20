const Ballot = require("../models/Ballot");
const Member = require("../models/Member");
const Group = require("../models/Group");

/**
 * Retrieves all ballots from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response containing the success status and the list of ballots.
 */

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

// Document this later
exports.checkRank = async (req, res) => {
   const { rank, group } = req.body;

  try {
    // Check if the rank is already used in the given group
    const existingBallot = await Ballot.findOne({ rank, group });

    if (existingBallot) {
      return res.json({ unique: false });
    }

    res.json({ unique: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Creates a new ballot.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response containing the success status, the new ballot, and a message.
 */

exports.createBallot = async (req, res) => {
  try {
    const { userName, hasBalloted, rank, memberEmail, group } = req.body;
    if (!userName || !hasBalloted || !rank || !memberEmail || !group) {
      return res.status(400).json({
        success: false,
        message: "Some fields are missing",
      });
    }

    // Check if ballot is open for the group
    const groupDetails = await Group.findOne({ title: group.toLowerCase() });
    if (groupDetails.isBallotOpen === false) {
      return res.status(403).json({
        success: false,
        message:
          "Ballot is closed for this group. Contact your admin to open it",
      });
    }

    // Check if the user has already balloted for the group
    // const existingBallot = await Ballot.findOne({ memberEmail, group });
    // if (existingBallot) {
    //   return res.status(409).json({
    //     success: false,
    //     message:
    //       "You have already balloted in this group. You can only ballot once!",
    //   });
    // }

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

/**
 * Retrieves the ranks of members in a given group.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status, the ballot list, and a message.
 * If the ballot list is found, the success status is true, the ballot list is returned, and a success message is returned.
 * If the ballot list is not found, the success status is false, the ballot list is returned, and a failure message is returned.
 * If an error occurs, the success status is false, and a failure message is returned.
 */

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
