var express = require("express");
var router = express.Router();
var ctrlLocations = require("../controllers/ctrlLocation");
var ctrlOthers = require("../controllers/ctrlOther")

/*Get home page */
router.get("/",ctrlLocations.homelist);
//router.get("/",ctrlLocations.angularView);
router.get("/location/:locationid",ctrlLocations.locationInfo);
router.get("/location/:locationid/review/new",ctrlLocations.addReview);
router.post("/location/:locationid/review/new",ctrlLocations.doAddReview);

/*Get About page */
router.get("/about",ctrlOthers.about);


module.exports = router;