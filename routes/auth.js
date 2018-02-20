const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');

router.post('/signin', async (req, res) => {
	data = {};
	try {
		await userController.signIn(req,res);
		res.redirect(302, "/");
	} catch(e) {
		data.error = e;
		res.render('auth/signin', data);
	}
});

router.get('/signin', (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	res.render('auth/signin', data);
});

router.post('/signup', (req, res) => {
	const data = userController.signUp(req,res);
	data.userId = req.session.userId;
res.render('auth/signup', data);
});

router.get('/signup', (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	res.render('auth/signup', data);
});

router.get('/signout', (req, res) => {
	const data = {};
	req.session.destroy();
	res.redirect(302, '/auth/signin');
});

router.get('/forgot', (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	res.render('auth/forgot', data);
});

router.get('/reset', (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	res.render('auth/reset', data);
});

module.exports = router;
