const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

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

const signup = async (req, res, next) => {

  const error = validationResult(req);
  
  if (!error.isEmpty()) {
    console.log(error);
     next(new HttpError("invalid inputs please try again", 422));
  }

  const { name, email, password ,places} = req.body;
  let existingUser;
  try {
     existingUser = await User.findOne({email:email})
  } catch (erro) {
    return next(new HttpError("Sign up failed", 422));
  }


  
  if(existingUser){
    const error = new HttpError("Exisitng user, please ologin instead", 422);
    return next(error);
  }
  
  const createdUser = new User({
    name,
    email,
    image:'https://www.shutterstock.com/shutterstock/photos/2275817317/display_1500/stock-photo-happy-man-standing-on-road-in-front-of-trees-2275817317.jpg',
    password,
    places
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up  falied", 422);
    return next(error);
  }

  
  res.json({ user: createdUser.toObject({getters:true})});
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
