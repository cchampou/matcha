
const database = require('../config/database.js');
const db = database.db;
const notifModel = require('./notif.js');
const popModel = require("./pop.js");

exports.create = async (from, to) => {
	return new Promise(async (resolve, reject) => {
		await notifModel.create(from, to, 1);
		db.query('INSERT INTO likes SET ?', {
			owner: from,
			target: to
		}, async (err, data) => {
			if (err) {
				reject(err);
			} else {
				try {
					await popModel.alter(to, +10);
					resolve();
				} catch(e) {
					reject(e);
				}
			}
		});
	});
}

exports.delete = (from, to) => {
	return new Promise(async (resolve, reject) => {
		db.query('DELETE FROM likes WHERE owner = ? AND target = ?', [from, to], async (err, data) => {
			if (err) {
				reject(err);
			} else {
				try {
					await popModel.alter(to, -10);
					resolve();
				} catch(e) {
					reject(e);
				}
			}
		});
	});
}


exports.get = (from, to) => {
	return new Promise((resolve, reject) => {
		db.query("SELECT owner, target FROM likes WHERE target = ? OR owner = ?", [from, to], (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

exports.getMatch = (id) => {
	return new Promise((resolve, reject) => {
		const out = [];
		db.query("SELECT * FROM likes WHERE owner = ?", [id], (err, data) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				data = data.map((e) => {
					return e.target;
				});
				db.query("SELECT * FROM likes LEFT JOIN users ON users.id = likes.owner WHERE likes.target = ?", [id], (err, out) => {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						out = out.filter((elem) => {
							if (data.indexOf(elem.owner) != -1) {
								return true;
							} else {
								return false;
							}
						});
						resolve(out);
					}
				});
			}
		})
	});
}
