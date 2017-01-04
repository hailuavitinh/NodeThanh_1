var express = require("express");
var router = express.Router();
var ctrlLocations = require("../controllers/ctrlLocation");
var ctrlOthers = require("../controllers/ctrlOther")

/*Get home page */
router.get("/",ctrlLocations.homelist);
router.get("/location",ctrlLocations.locationInfo);
router.get("/location/review/new",ctrlLocations.addReview);

/*Get About page */
router.get("/about",ctrlOthers.about);


module.exports = router;