
const database = require('../config/database.js');
const db = database.db;

exports.get = (from, to) => {
	return new Promise((resolve, reject) => {
		db.query("SELECT * FROM messages WHERE (owner = ? AND target = ?) OR (owner = ? AND target = ?)", [from, to, to, from], (err, data) => {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

exports.read = (from, to) => {
	return new Promise((resolve, reject) => {
		db.query("UPDATE messages SET seen = 1 WHERE (target = ? AND owner = ?)", [from, to], (err, data) => {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

exports.create = (from, to, content, seen) => {
	return new Promise((resolve, reject) => {
		db.query("INSERT INTO messages SET ?", {
			owner : from,
			target : to,
			content : content,
			seen : seen
		}, (err, data) => {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				return resolve();
			}
		})
	})
}
