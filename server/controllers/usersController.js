const User = require("../data/User");

const getAllUsers = async (req, res) => {
  const users = await User.find().select(
    "_id firstName lastName email title access"
  );
  if (!users) return res.status(204).json({ message: "No users found." });
  res.json(users);
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user)
    return res
      .status(204)
      .json({ message: `User ID "${req.params.id}" not found.` });
  res.json(user);
};

const createNewUser = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname || !req?.body?.email) {
    return res.status(400).json({
      message: `First/last names and email are required, sent: ${JSON.stringify(
        req.body
      )}`,
    });
  }
  try {
    newUser = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      access: ["read_only"],
    };
    if (req.body?.middlename) newUser.middleName = req.body.middlename;
    if (req.body?.title) newUser.title = req.body.title;
    if (req.body?.access) newUser.access.push(...req.body.access);
    const result = await User.create(newUser);
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    return res.status(409).json({
      message: `User with email "${req.body.email}" already exists`,
    });
  }
};

const updateUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID is required." });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user)
    return res
      .status(204)
      .json({ message: `User ID "${req.body.id}" not found.` });
  if (req.body?.firstname) user.firstname = req.body.firstname;
  if (req.body?.middlename) user.middlename = req.body.middlename;
  if (req.body?.lastname) user.lastname = req.body.lastname;
  if (req.body?.email) user.email = req.body.email;
  if (req.body?.access) user.access = req.body.access;
  if (req.body?.image) user.image = req.body.image;
  const result = await user.save();
  res.json(result);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID is required." });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID "${req.body.id}" not found.` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

module.exports = {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
};
