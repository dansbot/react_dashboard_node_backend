const mongoose = require("mongoose");

const connectDB = async () => {
  console.log(process.env.DATABASE_URI);
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
