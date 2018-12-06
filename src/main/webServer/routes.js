const express = require("express"),
	router = express.Router();

//GET home page.

router.get('/getData', function (req, res, next) {
	let classToJobDb = new global.ClassToJobDb();
	let cursor = classDb.findByStatus(1);
	console.log(cursor);
	cursor.exec((error,docs) =>{
		res.send(docs);
	});
	cursor.exec((error, docs) => {
	})
	
});
module.exports = router;
