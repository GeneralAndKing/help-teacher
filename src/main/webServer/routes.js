const express = require("express"),
	router = express.Router();

//GET home page.

router.get('/getData', function (req, res, next) {
	let classToJobDb = new global.ClassToJobDb();
	let cursor = classToJobDb.findByStatus(1);
	cursor.exec((error,docs) =>{
		res.send(docs);
	});
	
});
module.exports = router;
