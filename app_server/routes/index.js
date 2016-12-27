var express = require("express");
var router = express.Router();
var ctrMain = require("../controllers/main");

/*Get home page */
router.get("/",ctrMain.index);

module.exports = router;