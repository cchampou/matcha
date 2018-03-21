const database = require('../config/database.js');
const db = database.db;

module.exports = {
	alter: (id, offset) => {
		return new Promise((resolve, reject) => {
			db.query("SELECT pop FROM users WHERE id = ?", [id], (err, data) => {
				if (err) {
					reject(err);
				} else {
					db.query("UPDATE users SET ? WHERE id = ?", [{
						pop: data[0].pop + offset
					}, id], (err, data) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					})
				}
			});
		});
	}
}
