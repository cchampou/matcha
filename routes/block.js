const express = require('express');
const router = express.Router();

const blockModel = require('../models/block.js');

router.get('/toggle/:id', (req, res) => {
	if (req.session.userId) {
		blockModel.toggle(req.session.userId, req.params.id);
	}
	res.redirect('/');
});

module.exports = router;
