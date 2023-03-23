const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { HttpError, ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `Email ${email} in use`);
  }
  const hashPassword = await bcryptjs.hashSync(
    password,
    bcryptjs.genSaltSync(10)
  );
  const newUser = await User.create({
    ...req.body,
    name,
    password: hashPassword,
  });
  // const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "2h" });
  // await User.findByIdAndUpdate(newUser._id, { token });
  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const isValidPassword = await bcryptjs.compareSync(password, user.password);
  if (!isValidPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const current = async (req, res) => {
  const { email } = req.user;
  res.status(200).json({ email });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
};
