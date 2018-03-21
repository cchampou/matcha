const database = require('../config/database');
const db = database.db;
const popModel = require('./pop.js');

module.exports = {
	toggle: (from, to) => {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM blocks WHERE owner = ? AND target = ?", [from, to], (err, data) => {
				if (err) {
					reject(err);
				} else {
					if (data[0]) {
						db.query("DELETE FROM blocks WHERE owner = ? AND target = ?", [from, to], async (err, data) => {
							if (err) {
								reject(err);
							} else {
								try {
									await popModel.alter(to, +50);
									resolve();
								} catch(e) {
									reject(e);
								}
							}
						})
					} else {
						db.query("INSERT INTO blocks SET ?", {
							owner: from,
							target: to
						}, async (err, data) => {
							if (err) {
								reject(err);
							} else {
								try {
									await popModel.alter(to, -50);
									resolve();
								} catch(e) {
									reject(e);
								}
							}
						});
					}
				}
			});
		})
	}
}
