const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // this line is for split the toke, in the headers should be like authorization: 'Bearer TOKEN' so that is why we need to split the value

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Authentication failed", 401);
    }

    const decodedToken = jwt.verify(token, "secret_dont_share");
    req.userData = {
      userId: decodedToken.userId
    };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
};
