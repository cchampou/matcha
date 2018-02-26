
const database = require('../config/database.js');
const db = database.db;

exports.get = async () => {
	return new Promise((resolve, reject) => {
		db.query("SELECT tag FROM tags", (err, data) => {
			resolve(data);
		});
	});
}

exports.save = async (tags) => {
	return new Promise((resolve, reject) => {
		const list = JSON.parse(tags);
		list.map((tag) => {
			db.query("SELECT tag FROM tags WHERE tag = ?", [tag], (err, data) => {
				if (!data.length) {
					db.query("INSERT INTO tags SET ?", {
						tag: tag
					}, (err, data) => {
						if (err) {
							console.log(err);
						}
					})
				}
			});
		});
		resolve();
	});
}
