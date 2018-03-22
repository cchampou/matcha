
const database = require('../config/database.js');
const db = database.db;
const sockets = require('../sockets.js');
const userModel = require('./user.js');

exports.create = (owner, target, type) => {
	console.log("Creating notif type "+type+" from "+owner+" to "+target);
	return new Promise((resolve, reject) => {
		if (owner == target) {
			return resolve();
		}
		db.query("SELECT * FROM notifs WHERE owner = ? AND target = ? AND type = ?", [owner, target, type], (err, data1) => {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				if (data1[0] && type == 0) {
					return resolve();
				}
				db.query("SELECT * FROM notifs WHERE owner = ? AND target = ? AND type = 1", [target, owner], (err, data) => {
					if (err) {
						console.log(err);
						return reject(err);
					} else if (data[0] && data[0].type == 1 && type == 1) {
						type = 2;
					}
					db.query("INSERT INTO notifs SET ?", {
						owner: owner,
						target: target,
						type: type
					}, async (err, data) => {
						if (err) {
							console.log(err);
							reject(err);
						} else {
							const fromUser = await userModel.get(owner);
							sockets.emitNotif(fromUser, target, type);
							if (type == 2) {
								db.query("INSERT INTO notifs SET ?", {
									owner: target,
									target: owner,
									type: type
								}, async (err, data) => {
									if (err) {
										console.log(err);
										reject(err);
									} else {
										const fromUser = await userModel.get(target);
										sockets.emitNotif(fromUser, owner, type);
										return resolve();
									}
								})
							} else {
								return resolve();
							}
						}
					})
				});
			}
		});
	});
}

exports.get = (target) => {
	return new Promise((resolve, reject) => {
		db.query("SELECT * FROM notifs LEFT JOIN users ON users.id = notifs.owner WHERE target = ? ORDER BY notifs.id DESC", [target], (err, data) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(data);
			}
		})
	});
}
