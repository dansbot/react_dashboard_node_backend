const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: String,
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  access: {
    type: Array,
    default: ["read_only"],
  },
  password: String,
  title: String,
  image: String,
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
