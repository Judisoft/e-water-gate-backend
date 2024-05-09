const Member = require("../models/Member");
const { addMemberToGroup } = require("../utils/addMemberToGroup");

/**
 * Retrieves all members from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status, the members list, and a message.
 * If the members list is empty, the success status is true, the members list is empty, and a message is returned.
 * If the members list is not empty, the success status is true, the members list is returned, and no message is returned.
 * If an error occurs, the success status is false, and a failure message is returned.
 */

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({});
    if (members.length === 0) {
      return res.status(200).json({
        success: true,
        members,
        message: "There're no members available",
      });
    }
    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Operation failed! Try again",
    });
  }
};

/**
 * Retrieves a single member from the database based on the provided member ID.
 *
 * @param {Object} req - The request object containing the member ID.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status and the retrieved member.
 */
exports.getSingleMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await Member.findOne({ _id: memberId }).exec();
    if (member.length === 0) {
      return res.status(404).json({
        success: false,
        message: "The requested member doesn't exist",
      });
    }
    return res.status(200).json({
      success: true,
      member,
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
 * Creates a new member in the specified group.
 *
 * @param {Object} req - The request object containing the member's email and group.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status, the created member, and a message.
 */

exports.createMember = async (req, res) => {
  try {
    const { email, group } = req.body;
    console.log(req.body);
    if (!email || !group) {
      return res.status(403).send({
        success: false,
        message: "All fields are required",
      });
    }

    const member = { email, group };

    const addMemberResult = await addMemberToGroup(member);

    return res.status(200).json({
      success: true,
      member,
      message: `${email} added to ${group}`,
      addMemberResult: addMemberResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add member. Please try again.",
    });
  }
};

/**
 * Updates a member in the database.
 *
 * @param {Object} req - The request object containing the member's ID and updated information.
 * @param {Object} res - The response object for sending the result.
 * @return {Promise<Object>} A JSON object containing the success status and the updated member.
 */
exports.updateMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const existingMember = await Member.findOne({ _id: memberId }).exec();
    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: "Member does not exist!",
      });
    }
    const member = await Member.findOneAndUpdate({ _id: memberId }, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      succes: true,
      member,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Member update failed! Try again",
    });
  }
};

/**
 * Deletes a member from the database.
 *
 * @param {Object} req - The request object containing the member ID.
 * @param {Object} res - The response object for sending the result.
 * @return {Promise<Object>} A JSON object containing the success status and a message indicating the result of the operation.
 */

exports.deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const existingMember = await Member.findOne({ _id: memberId }).exec();
    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: "Member does not exist!",
      });
    }
    const member = await Member.findOneAndDelete({ _id: memberId });
    return res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
