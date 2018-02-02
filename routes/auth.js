const express = require('express');
const router = express.Router();

router.get('/signin', (req, res) => {
	res.render('auth/signin');
});

router.get('/signup', (req, res) => {
	res.render('auth/signup');
});

router.get('/forgot', (req, res) => {
	res.render('auth/forgot');
});

router.get('/reset', (req, res) => {
	res.render('auth/reset');
});

module.exports = router;
