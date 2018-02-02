const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('chat/default.ejs');
});

router.get('/:id', (req, res) => {
	res.render('chat/chatting.ejs');
});

module.exports = router;
