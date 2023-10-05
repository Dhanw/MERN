const axios = require("axios");
const HttpError = require("../models/http-error");
const APY_KEY = "AIzaSyCY9knSJajj8A6GXbv8U079tNch9elJ9do";

async function getCoordsForAddress(address) {
  //return {
  // lat: 40.7484474,
  //  lng: -73.9871516,
  //  };
  // https://maps.googleapis.com/maps/api/geocode/json?address=575 Madison Ave, New York, NY 10022, United States&AIzaSyCY9knSJajj8A6GXbv8U079tNch9elJ9do

  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key${APY_KEY}`

  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${APY_KEY}`);

  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "could not find location for the specified address",
      422
    );
    throw error;
  }

  console.log(data);

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
