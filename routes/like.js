const express = require('express');
const router = express.Router();

const likeModel = require('../models/like');

router.get('/create/:id', async (req, res) => {
	console.log("Like from "+req.session.userId+" to "+req.params.id);
	try {
		await likeModel.create(req.session.userId, req.params.id);
	} catch (e) {
		console.log(e);
	}
	res.redirect(302, '/user/'+req.params.id);
});

router.get('/delete/:id', async (req, res) => {
	console.log("Dislike from "+req.session.userId+" to "+req.params.id);
	try {
		await likeModel.delete(req.session.userId, req.params.id);
	} catch (e) {
		console.log(e);
	}
	res.redirect(302, '/user/'+req.params.id);
});


module.exports = router;
