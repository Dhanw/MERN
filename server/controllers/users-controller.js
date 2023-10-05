const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");



let DUMMY_USERS = [
  {
    id: "u1",
    name: "Pedro Perez",
    email: "test.@test.com",
    password: "testers",
  },
  {
    id: "u2",
    name: "Joao Pereira",
    email: "test1.@test1.com",
    password: "testers",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {

  const error = validationResult(req);
  
  if (!error.isEmpty()) {
    console.log(error);
    throw new HttpError("invalid inputs please try again", 422);
  }

  const { name, email, password } = req.body;
  const hasUser=DUMMY_USERS.find(u=>u.email===email);

  if (hasUser){
    throw new HttpError('Could not create user, email already exists', 422);
  }
  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identified  user, credentials or email seems to be wrong",
      401
    );
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
