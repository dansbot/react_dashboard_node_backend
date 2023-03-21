const User = require("../data/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res
      .status(401)
      .json({ message: `Unauthorized. No web token found.` });
  }
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser)
    return res.status(403).json({ error: "Access denied: user not found" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded.userInfo.id)
      return res
        .status(403)
        .json({ error: "Access denied: user has the wrong id" });
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
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    res.json({ accessToken, userInfo });
  });
};

module.exports = { handleRefreshToken };
