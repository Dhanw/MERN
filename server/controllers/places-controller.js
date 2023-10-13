const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require('fs');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("could not find the place with the ID", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("could not find the place with the ID", 500);
    return next(error);
  }

  // mongodb store the id with _id variable so we get rid of it with the gatters property
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
    console.log(userId);
  } catch (err) {
    const error = new HttpError(
      `could not find the place with that ID + ${err}`,
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError("could not find a place for the user id", 404));
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ gatters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("invalid inputs please try again", 422));
  }

  const { title, description, address } = req.body; // creator

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId, // remove this line
  });

  console.log("This is the Id of the creator " + req.userData.userId)
  let user;
  try {
    user = await User.findById(req.userData.userId); // I need to use the data in the request that I add in the first middleware, in specific the check-auth middleware. 
  } catch (err) {
    const error = new HttpError(
      "creating place falied, user id was not found",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("could not find the user ", 400);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    await user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("could not create the place", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("invalid inputs please try again", 422));
  }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("could not update the place with the ID", 500);
    return next(error);
  }

  if(place.creator.toString() !== req.userData.userId){
    return next(new HttpError('you cannot edit  this place. ',401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("could not update the place with the ID", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ gatters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("could not find the place with the ID", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("could not delete the place with the ID", 404);
    return next(error);
  }

  console.log(place.creator._id)
  if(place.creator._id.toString() !== req.userData.userId){
    console.log(place.creator._id)
    return next(new HttpError('you cannot delete  this place. ',401));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess }); //needed to this function instead of places.remove. It seems that it is depracated.
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(`Could not delete the place + ${err}`, 500);
    return next(error);
  }

  fs.unlink(imagePath,err=>{
    console.log(err);
  })

  res.status(200).json({ message: "place deleted yeah!!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
