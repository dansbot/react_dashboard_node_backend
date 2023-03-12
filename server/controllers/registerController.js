const User = require("../data/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  if (
    !req?.body?.firstname ||
    !req?.body?.lastname ||
    !req?.body?.email ||
    !req?.body?.password
  ) {
    return res.status(400).json({
      message: `First/last names, email and password are required. sent: ${req.body}`,
    });
  }
  // check for duplicate usernames
  const duplicate = await User.findOne({ email: req.body.email }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: `User with email: ${req.body.email} already exists.` }); //conflict
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    // create and store the new user
    newUser = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      access: ["read_only"],
      password: hashedPwd,
    };
    if (req.body?.middlename) newUser.middleName = req.body.middlename;
    if (req.body?.title) newUser.title = req.body.title;
    if (req.body?.image) newUser.image = req.body.image;
    if (req.body?.access) newUser.access.push(...req.body.access);
    const result = await User.create(newUser);
    res.status(201).json({ success: `${result}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
