const Ballot = require("../models/Ballot");
const Member = require("../models/Member");
const Group = require("../models/Group");

/**
 * Retrieves the ballot status of a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status and the user's ballot status.
 */
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

exports.activateBallot = async (req, res) => {
  try {
    const { groupId, isBallotOpen } = req.body;

    // Ensure groupId and isBallotOpen are provided in the request body
    if (!groupId || typeof isBallotOpen !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Your request is missing some fields",
      });
    }

    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: "Trying to activate ballot for a group that does not exist!",
      });
    }

    // Update the isBallotOpen field
    existingGroup.isBallotOpen = isBallotOpen;
    await existingGroup.save();

    return res.status(200).json({
      success: true,
      group: existingGroup,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to activate ballot! Try again",
    });
  }
};

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
