const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	res.render('chat/default.ejs', data);
});

router.get('/:id', (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	res.render('chat/chatting.ejs', data);
});

module.exports = router;
