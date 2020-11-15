const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  note: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Todo", todoSchema);
