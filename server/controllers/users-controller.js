const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching users failed ,try again later", 500));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {

    console.log(error);
    return next(new HttpError("invalid inputs please try again", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (erro) {
    return next(new HttpError("Sign up failed", 422));
  }

  if (existingUser) {
    const error = new HttpError("Exisitng user, please login instead", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up  falied", 422);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  const { email, password } = req.body;

  if (!error.isEmpty()) {
    console.log(error);
    next(new HttpError("invalid inputs please try again", 422));
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (erro) {
    return next(new HttpError("Sign up failed", 422));
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentialas  user", 422);
    return next(error);
  }

  res.json({
    message: "Logged in",
    user: existingUser.toObject({ gatters: true }),
  });

};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
