const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const tagModel = require('../models/tag.js');
const notifModel = require('../models/notif.js');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

router.get('/', async (req, res) => {
	const data = {};
	if (!req.session.userId) {
		res.redirect(302, '/auth/signin');
	}
	data.userId = req.session.userId;
	try {
		data.users = await userController.getAll(req, res);
		data.notifs = await notifModel.get(req.session.userId);
		res.render('user/list', data);
	} catch(e) {
		console.log(e);
		res.redirect(302, '/');
	}
});


const editUploads = upload.fields([
	{ name: 'photo1', maxCount: 1 },
	{ name: 'photo2', maxCount: 1 },
	{ name: 'photo3', maxCount: 1 },
	{ name: 'photo4', maxCount: 1 },
	{ name: 'photo5', maxCount: 1 }
]);

router.post('/edit', editUploads, async (req, res) => {
	const data = {};
	if (!req.session.userId) {
		res.redirect(302, '/auth/signin');
	}
	data.userId = req.session.userId;
	try {
		await userController.update(req, res);
		res.redirect(302, '/user/'+req.session.userId);
	} catch (e) {
		console.log(e);
		data.error = e;
		try {
			data.notifs = await notifModel.get(req.session.userId);
			data.tags = await tagModel.get();
			data.user = await userController.get(req, res);
			res.render('user/edit', data);
		} catch(e) {
			console.log(e);
			res.redirect(302, '/');
		}
	}
});

router.get('/edit', async (req, res) => {
	const data = {};
	if (!req.session.userId) {
		res.redirect(302, '/auth/signin');
	}
	try {
		data.userId = req.session.userId;
		data.notifs = await notifModel.get(req.session.userId);
		data.tags = await tagModel.get();
		data.user = await userController.get(req, res);
		res.render('user/edit', data);
	} catch (e) {
		console.log(e);
		res.redirect(302, '/');
	}
});

router.get('/:id', async (req, res) => {
	const data = {};
	if (!req.session.userId) {
		res.redirect(302, '/auth/signin');
	}
	try {
		await notifModel.create(req.session.userId, req.params.id, 0);
		data.userId = req.session.userId;
		data.user = await userController.get(req, res);
		data.notifs = await notifModel.get(req.session.userId);
		data.user.tags = JSON.parse(data.user.tags);
		res.render('user/profile', data);
	} catch (e) {
		console.log(e);
		res.redirect(302, '/');
	}
});

module.exports = router;
