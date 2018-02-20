const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');

router.post('/edit', async (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	try {
		await userController.update(req, res);
		res.redirect(302, '/user/'+req.session.userId);
	} catch (e) {
		console.log(e);
		data.error = e;
		try {
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
	try {
		data.userId = req.session.userId;
		data.user = await userController.get(req, res);
		res.render('user/edit', data);
	} catch (e) {
		console.log(e);
		res.redirect(302, '/');
	}
});

router.get('/:id', async (req, res) => {
	const data = {};
	try {
		data.userId = req.session.userId;
		data.user = await userController.get(req, res);
		res.render('user/profile', data);
	} catch (e) {
		console.log(e);
		res.redirect(302, '/');
	}
});

module.exports = router;
