const Group = require("../models/Group");
const user = require("../models/user");
const { addMemberToGroup } = require("../utils/addMemberToGroup");

/**
 * Retrieves all groups from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status and the list of groups.
 * If the operation is successful, the success status is true and the list of groups is returned.
 * If an error occurs, the success status is false and an error message is returned.
 */

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});
    return res.status(200).json({
      success: true,
      groups,
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
 * Retrieves a single group from the database based on the provided group ID.
 *
 * @param {Object} req - The request object containing the group ID.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status and the retrieved group.
 */
exports.getSingleGroup = async (req, res) => {
  try {
    const groupTitle = req.params.group.toLowerCase();
    const group = await Group.findOne({ title: groupTitle }).exec();

    if (!group) {
      // Check if group is null
      return res.status(404).json({
        success: false,
        message: "The requested group doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      group,
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
 * Creates a new group with the provided title and admin.
 *
 * @param {Object} req - The request object containing the group title and admin email.
 * @param {Object} res - The response object for sending the result.
 * @return {Promise<Object>} A JSON object with the success status and details of the created group.
 */
exports.createGroup = async (req, res) => {
  try {
    const { title, admin } = req.body;
    const group = new Group({ title, admin });

    const validationError = group.validateSync();

    // If validation fails, send the validation error in the response
    if (validationError) {
      const errors = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ success: false, errors });
    }

    // Check if group already exists
    const existingGroup = await Group.findOne({ title: title.toLowerCase() });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "Group already exists",
      });
    }

    await group.save();

    const memberData = {
      email: admin,
      group: title,
    };
    const addMemberResult = await addMemberToGroup(memberData);

    return res.status(201).json({
      success: true,
      group,
      message: "Group created successfully",
      addMemberResult: addMemberResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Group creation failed. Try again",
    });
  }
};

/**
 * Updates a group in the database.
 *
 * @param {Object} req - The request object containing the group ID and updated group information.
 * @param {Object} res - The response object for sending the result.
 * @return {Promise<Object>} A JSON object with the success status and the updated group.
 * If the group does not exist, a JSON object with the success status set to false and an error message is returned.
 * If the update fails, a JSON object with the success status set to false and an error message is returned.
 */

exports.updateGroup = async (req, res) => {
  try {
    const groupTitle = req.params.group.toLowerCase();
    const existingGroup = await Group.findOne({ title: groupTitle }).exec();

    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: "Group does not exist!",
      });
    }

    // Check if auth user is an admin of the group
    const isGroupAdmin = existingGroup.admin.includes(req.user.email);
    // add isGroupAdmin to the response payload
    if (!isGroupAdmin) {
      return res.status(403).json({
        success: false,
        isGroupAdmin: false,
        message:
          "You are not authorized to update this group. Only an admin can perform this action",
      });
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { title: groupTitle }, // Find the group by title
      { isBallotOpen: req.body.isBallotOpen }, // Update only the isBallotOpen property
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      group: updatedGroup,
      message: `Group ${
        req.body.isBallotOpen ? "opened" : "closed"
      } for balloting`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Group update failed! Try again",
    });
  }
};

/**
 * Deletes a group from the database.
 *
 * @param {Object} req - The request object containing the group ID.
 * @param {Object} res - The response object for sending the result.
 * @return {Promise<Object>} A JSON object with the success status and a message indicating the result of the operation.
 */

exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const existingGroup = await Group.findOne({ _id: groupId }).exec();
    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: "Group does not exist!",
      });
    }
    const group = await Group.findOneAndDelete({ _id: groupId });
    return res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
