const express = require("express"),
	router = express.Router();

//GET home page.

router.get('/getData', function (req, res, next) {
	res.send("data")
});
module.exports = router;
