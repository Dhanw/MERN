const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
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

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    const error=new Error('could not find a place for the id');
    error.code=404;
    throw error;
  }
  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  console.log("get request in places");
  if (!place) {
    const error=new Error('could not find a place for the user id');
    error.code=404;
    return next(error);
  }
  res.json({ place });
});

module.exports = router;
