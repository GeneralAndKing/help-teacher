// import ClassDb from "../dbServer/classDb"
const express = require("express"),
	router = express.Router();

//GET home page.

router.get('/getData', function (req, res, next) {
	let classDb = new global.ClassDb();
	let cursor = classDb.findByClassName("2016级计算机科学与技术2班");
	console.log(cursor);
	cursor.exec((error,docs) =>{
		res.send(docs);
	});
	cursor.exec((error, docs) => {
	})
	
});
module.exports = router;
