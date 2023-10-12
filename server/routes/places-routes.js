const express = require("express");
const placesController = require("../controllers/places-controller");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

//use express-validator for imputs checking. much better than react

router.get("/:pid", placesController.getPlaceById);
router.get("/user/:uid", placesController.getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesController.createPlace
);
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesController.updatePlace
);
router.delete("/:pid", placesController.deletePlace);

module.exports = router;
