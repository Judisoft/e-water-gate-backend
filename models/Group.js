const mongoose = require("mongoose");

GroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Group name must be at least 3 characters long"],
    maxlength: [50, "Group name must be at most 50 characters long"],
    trim: true,
  },
  admin: {
    type: [String],
    required: true,
    trim: true,
  },
  isBallotOpen: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", GroupSchema);
