const Member = require("../models/Member");

/**
 * Adds a member to a group. If the member already exists, it updates the group information. If the member is new, it creates a new member entry.
 *
 * @param {Object} member - The member object containing email and group information.
 * @return {Object} An object indicating the success status and additional details like the added member or an error message.
 */
exports.addMemberToGroup = async (member) => {
  try {
    const existingMember = await Member.findOne({ email: member.email });

    if (existingMember) {
      const existingMemGroups = existingMember.group;
      if (!existingMemGroups.includes(member.group)) {
        existingMember.group.push(member.group);
        await existingMember.save();
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          message: `${member.email} is already a member`,
        };
      }
    }

    const newMember = await Member.create({
      email: member.email,
      group: member.group,
    });

    return {
      success: true,
      member: newMember,
      message: `${member.eamil} added to ${member.group}`,
    };
  } catch (error) {
    throw new Error("Failed to add member. Please try again.");
  }
};
