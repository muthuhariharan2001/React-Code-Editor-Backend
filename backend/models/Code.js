const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ["javascript", "python", "cpp", "java", "go", "c", "sqlite3"],
  },
  version: {
    type: String, required: true,
  },
  code: {
    type: String, required: true,
  },
  input: {
    type: String, default: "",
  },
  output: {
    type: String, 
  },
  executionTime: {
    type: Number, // in milliseconds
  },
  createdAt: {
    type: Date, default: Date.now,
  },
});

module.exports = mongoose.model("Code", codeSchema);
