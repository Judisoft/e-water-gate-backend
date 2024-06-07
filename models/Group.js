const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
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

// Pre-save hook to convert the title to lowercase
GroupSchema.pre("save", function (next) {
  this.title = this.title.toLowerCase();
  next();
});

// Create a unique index on the title field in lowercase
GroupSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model("Group", GroupSchema);
