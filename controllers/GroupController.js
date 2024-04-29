const Group = require("../models/Group");
const user = require("../models/user");
const { addMemberToGroup } = require("../utils/addMemberToGroup");

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

exports.getSingleGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findOne({ _id: groupId }).exec();
    if (group.length === 0) {
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

exports.createGroup = async (req, res) => {
  try {
    // Get input data
    const { title, admin } = req.body;

    // Create a new group instance
    const group = new Group({ title, admin });

    // Validate the group instance
    const validationError = group.validateSync();

    // If validation fails, send the validation error in the response
    if (validationError) {
      const errors = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ success: false, errors });
    }

    // Check if group already exists
    const existingGroup = await Group.findOne({ title });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "Group already exists",
      });
    }

    // Save the group to the database
    await group.save();

    // Add group creator (admin) as member to group
    // Assuming you have a function called `addMemberToGroup`

    const memberData = {
      email: admin,
      group: title,
    };
    const addMemberResult = await addMemberToGroup(memberData);

    return res.status(200).json({
      success: true,
      group,
      message: "Group created successfully",
      addMemberResult: addMemberResult,
    });
  } catch (error) {
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Group creation failed. Try again",
    });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const existingGroup = await Group.findOne({ _id: groupId }).exec();
    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: "Group does not exist!",
      });
    }
    const group = await Group.findOneAndUpdate({ _id: groupId }, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      succes: true,
      group,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Group update failed! Try again",
    });
  }
};

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
