const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');

router.get('/signin', (req, res) => {
	res.render('auth/signin');
});

router.post('/signup', (req, res) => {
	const data = userController.signup(req,res);
	res.render('auth/signup', data);
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
