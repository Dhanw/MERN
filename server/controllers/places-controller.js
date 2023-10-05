const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "emprire state",
    description: "fampur",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "Esta es una direccion",
    creator: "u1",
  },
  {
    id: "p2",
    title: "eiffel tower",
    description: "located in paris",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "Esta es una direccion",
    creator: "u2",
  },
];

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

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("could not find the place with that ID", 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(new HttpError("could not find a place for the user id", 404));
  }

  res.json({
    places: places.map((place) => place.toObject({ gatters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("invalid inputs please try again", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  const createPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://media.istockphoto.com/id/626591042/es/foto/edificio-empire-state-de-la-ciudad-de-nueva-york.jpg?s=612x612&w=is&k=20&c=Vp-AWuYwb3PTM6PjuZrc5WYyo5UAUfGXXovbEa5gtT4=",
    creator,
  });
  try {
    await createPlace.save();
  } catch (err) {
    const error = new HttpError("creating falied", 500);
    return next(error);
  }

  res.status(201).json({ place: createPlace, places: DUMMY_PLACES });
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

  place.title = title;
  place.description = description;

  try{
    await place.save();
  }catch(err){
    const error = new HttpError("could not update the place with the ID", 500);
    return next(error);
  }

  res.status(200).json({ place:place.toObject({gatters:true}) });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id.", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "place deleted yeah!!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
