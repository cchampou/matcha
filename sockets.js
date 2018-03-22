
const notifModel = require('./models/notif.js');
const messageModel = require('./models/message.js');


module.exports = {

	emitNotif: (from, to, type) => {
		console.log("Trying to emit notif");
		if (this.online[to]) {
			console.log("User is online, emitting");
			this.io.sockets.to(this.online[to]).emit('notif', {
				type: type,
				from: from,
				to: to
			});
		}
	},

	init: (http) => {
		this.online = [];
		console.log("initializing sockets");
		this.io = require('socket.io')(http);
		this.io.on('connection', (socket) => {
			console.log("Socket connection");
			let me = null;
			socket.on('login', (user) => {
				this.online[user.userId] = socket.id;
				me = user.userId;
				this.io.sockets.emit('login', {
					id: user.userId
				});
			});

			socket.on('message', async (opts) => {
				if (this.online[opts.to]) {
					await messageModel.create(opts.from, opts.to, opts.content, 1);
					this.io.sockets.to(this.online[opts.to]).emit('message', {
						content: opts.content,
						from: opts.from,
						to: opts.to
					});
				} else {
					await messageModel.create(opts.from, opts.to, opts.content, 0);
				}
			});

			this.online.map((e, id) => {
				if (e) {
					socket.emit('login', {
						id: id
					});
				}
			});

			socket.on('disconnect', () => {
				if (me) {
					delete this.online[me];
					this.io.sockets.emit('logout', {
						id: me
					});
				}
			})
		});
	}
}
