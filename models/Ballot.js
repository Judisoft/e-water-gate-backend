const mongoose = require("mongoose");
const Member = require("../models/Member");
const { sendEmails } = require("../utils/sendEmails");

BallotSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  hasBalloted: {
    type: Boolean,
    default: false,
  },
  rank: {
    type: Number,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  memberEmail: {
    type: String,
    required: true,
  },
});

BallotSchema.pre("save", async function (next) {
  // get all members of a group
  const emails = [];
  const members = await Member.find();
  const balloter = {
    userName: this.userName,
    userEmail: this.memberEmail,
    userRank: this.rank,
    userGroup: this.group,
  };

  members.map((member) => {
    if (member.group.includes(this.group)) {
      emails.push(member.email);
    }
  });
  sendEmails(balloter, emails);
});

module.exports = mongoose.model("Ballot", BallotSchema);
