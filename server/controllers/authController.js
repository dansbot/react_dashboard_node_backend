const User = require("../data/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and password are required." });
  }
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser)
    return res.status(401).json({ message: `No user with email: ${email}` }); // unauthorized

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create jwt
    const userInfo = {
      id: foundUser._id,
      firstName: foundUser.firstName,
      middleName: foundUser.middleName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      title: foundUser.title,
      image: foundUser.image,
      access: foundUser.access,
    };
    const accessToken = jwt.sign(
      { userInfo: userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { userInfo: userInfo },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
    // update refreshToken for User
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: !process.env.IS_DEV,
      maxAge: process.env.JWT_MAX_AGE,
      domain: req.hostname,
      path: req.path,
    });

    res.json({ accessToken, userInfo });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
};

module.exports = { handleLogin };
