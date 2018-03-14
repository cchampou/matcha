const express = require('express');
const router = express.Router();
const notifModel = require('../models/notif.js');
const likeModel = require('../models/like.js');
const userModel = require('../models/user.js');
const messageModel = require('../models/message.js');

router.get('/', async (req, res) => {
	const data = {};
	if (!req.session.userId) {
		return res.redirect(302, '/auth/signin');
	}
	data.users = await likeModel.getMatch(req.session.userId);
	data.newmessages = await messageModel.getUnread(req.session.userId);
	data.users.map((user, key) => {
		data.users[key].unread = 0;
		data.newmessages.map((e) => {
			if (e.owner == user.id) {
				data.users[key].unread += 1;
			}
		})
	});
	data.notifs = await notifModel.get(req.session.userId);
	data.userId = req.session.userId;
	res.render('chat/default.ejs', data);
});

router.get('/:id', async (req, res) => {
	const data = {};
	if (!req.session.userId) {
		return res.redirect(302, '/auth/signin');
	}
	data.userId = req.session.userId;
	data.notifs = await notifModel.get(req.session.userId);
	await messageModel.read(req.session.userId, req.params.id);
	data.newmessages = await messageModel.getUnread(req.session.userId);
	data.messages = await messageModel.get(req.session.userId, req.params.id);
	data.user = await userModel.get(req.params.id);
	res.render('chat/chatting.ejs', data);
});

module.exports = router;
