const express = require('express');
const router = express.Router();

const likeModel = require('../models/like');

router.get('/create/:id', (req, res) => {
	console.log("Like from "+req.session.userId+" to "+req.params.id);
	likeModel.create(req.session.userId, req.params.id);
	res.redirect(302, '/user/'+req.params.id);
});

router.get('/delete/:id', (req, res) => {
	console.log("Dislike from "+req.session.userId+" to "+req.params.id);
	likeModel.delete(req.session.userId, req.params.id);
	res.redirect(302, '/user/'+req.params.id);
});


module.exports = router;
