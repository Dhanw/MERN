const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("could not create the passsword", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password:hashPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up  falied", 500);
    return next(error);
  }

  // authentication done using jwt
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up  falied", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  if (!existingUser) {
    const error = new HttpError("Invalid credentialas  user", 422);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("could not login the credentials", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("could not login with the credentials", 401));
  }

  //console.log(existingUser._id);

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Loggin in up  falied", 500);
    return next(error);
  }

  res.json({
    userId: existingUser._id,
    email: existingUser.email,
    token:token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
