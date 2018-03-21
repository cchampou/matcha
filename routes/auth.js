const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const messageModel = require('../models/message.js');
const notifModel = require('../models/notif.js');

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

router.get('/signin/ok', (req, res) => {
	const data = {};
	data.message = "Votre compte a bien été créé, vous pouvez désormais vous connecter";
	data.userId = req.session.userId;
	res.render('auth/signin', data);
});

router.get('/signin/resetok', (req, res) => {
	const data = {};
	data.message = "Votre mot de passe a bien été modifié, vous pouvez vous reconnecter";
	data.userId = req.session.userId;
	res.render('auth/signin', data);
});

router.post('/signup', async (req, res) => {
	const data = await userController.signUp(req,res);
	data.userId = req.session.userId;
	console.log(data);
	res.render('auth/signup', data);
});

router.get('/signup', (req, res) => {
	const data = {};
	data.name = '';
	data.firstname = '';
	data.username = '';
	data.email = '';
	data.gender = '';
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

router.post('/forgot', async (req, res) => {
	const data = await userController.forgot(req, res);
	data.userId = req.session.userId;
	res.render('auth/forgot', data);
});

router.get('/reset/:hash', async (req, res) => {
	const data = {};
	data.hash = req.params.hash;
	data.newmessages = await messageModel.getUnread(req.session.userId);
	data.notifs = await notifModel.get(req.session.userId);
	data.userId = req.session.userId;
	res.render('auth/reset', data);
});

router.post('/reset', async (req, res) => {
	const data = await userController.reset(req, res);
	data.newmessages = await messageModel.getUnread(req.session.userId);
	data.notifs = await notifModel.get(req.session.userId);
	data.hash = req.body.hash;
	data.userId = req.session.userId;
	res.render('auth/reset', data);
});

router.get('/validate/:hash', async (req, res) => {
	const data = await userController.validate(req, res);
	data.newmessages = await messageModel.getUnread(req.session.userId);
	data.notifs = await notifModel.get(req.session.userId);
	data.userId = req.session.userId;
	res.render('auth/validate', data);
})

module.exports = router;
