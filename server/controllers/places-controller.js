const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError("could not find a place for the id", 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(HttpError("could not find a place for the user id", 404));
  }
  res.json({ places });
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

  const createPlace = {
    id: uuid(),
    title,
    description,
    address,
    creator,
    location: coordinates,
  };

  DUMMY_PLACES.push(createPlace);

  res.status(201).json({ place: createPlace, places: DUMMY_PLACES });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error);
    throw new HttpError("invalid inputs please try again", 422);
  }
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(201).json({ place: updatedPlace, Places: DUMMY_PLACES });
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
