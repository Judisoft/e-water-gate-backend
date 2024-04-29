const Member = require("../models/Member");
const { addMemberToGroup } = require("../utils/addMemberToGroup");

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

exports.createMember = async (req, res) => {
  try {
    //get input data
    const { email, group } = req.body;
    console.log(req.body);
    // Check if All Details are there or not
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
