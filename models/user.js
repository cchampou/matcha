
const ejs = require('ejs');
const bcrypt = require('bcrypt');

const database = require('../config/database.js');
const db = database.db;

const mail = require('../config/mail.js');
const mainConfig = require('../config/main.js');

exports.signUp = (fname, name, uname, email, pass, conf, gender) => {
	return new Promise(async (resolve, reject) => {
		const regexp = /[a-z]+[1-9]+/i;
		if (pass.length < 8 || !regexp.test(pass)) {
			reject("Le mot de passe doit contenir au moins 8 caracteres, des chiffres et des lettres");
		}
		if (pass != conf) {
			reject("Le mot de passe et sa confirmation ne correspondent pas");
		}
		const hash = await bcrypt.hash(pass, 10);
		const tmp_hash = Math.floor(Math.random() * 1000000000);
		db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
			if (err) {
				reject(err);
			} else {
				if (data[0]) {
					reject("Cette adresse email a déjà été utilisée");
				} else {
					db.query("INSERT INTO users SET ?", {
						firstname: fname,
						name: name,
						username: uname,
						email: email,
						hash: hash,
						gender: gender,
						tmp_hash: tmp_hash
					}, async (err, res) => {
						if (err) {
							throw err;
						} else {
							ejs.renderFile('./templates/inscription.ejs', { firstname: fname, host: mainConfig.host, tmp_hash: tmp_hash }, function (err, data) {
								if (err) {
									reject(err);
								} else {
									mail.sendMail(email, 'Inscription à Matcha', data);
									resolve();
								}
							});
						}
					});
				}
			}
		})
	});
};

exports.signIn = (email, password) => {
	return new Promise(function(resolve, reject) {
		console.log("Entering signin data process with email "+email);
		db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
			if (err) {
				reject(err);
			} else if (!data[0]) {
				console.log("Authentification : no user with this email");
				reject("Utilisateur inconnu");
			} else {
				bcrypt.compare(password, data[0].hash, (err, res) => {
					if (res) {
						console.log("Authentification : success for user "+data[0].id);
						resolve(data[0].id);
					} else {
						reject("Informations de connexion incorrectes");
						console.log("Authentification : fail, password does not match");
					}
				});
			}
		});
	});
}

exports.get = (id) => {
	return new Promise((resolve, reject) => {
		console.log("Getting user "+id);
		db.query("SELECT id, name, firstname, username, email, gender, interest, bio, photo1, photo2, photo3, photo4, photo5, age, location, pop, tags FROM users WHERE id = ?", [id], (err, data) => {
			if (err) {
				reject(err);
			} else if (!data[0]) {
				reject(new Error("Utilisateur introuvable"));
			} else {
				resolve(data[0]);
			}
		})
	});
}

exports.getAll = (exclude) => {
	return new Promise((resolve, reject) => {
		console.log("Starting user listing");
		db.query("SELECT id, name, firstname, username, gender, interest, bio, photo1, photo2, photo3, photo4, photo5, age, location, pop, tags FROM users WHERE id != ?", [exclude], (err, data) => {
			if (err) {
				reject(err);
			} else {
				console.log("User listed successfully");
				resolve(data);
			}
		})
	});
}

exports.getFiltered = (exclude, ageMin, ageMax, popMin, popMax, tags) => {
	return new Promise((resolve, reject) => {
		console.log("Starting user listing");
		if (!ageMin) {
			ageMin = 0;
		}
		if (!ageMax) {
			ageMax = 1000;
		}
		if (!popMin) {
			popMin = 0;
		}
		if (!popMax) {
			popMax = 1000000;
		}
		db.query("SELECT id, name, firstname, username, gender, interest, bio, photo1, photo2, photo3, photo4, photo5, age, location, pop, tags FROM users WHERE id != ? AND age >= ? AND age <= ? AND pop >= ? AND pop <= ? ", [exclude, ageMin, ageMax, popMin, popMax], (err, data) => {
			if (err) {
				reject(err);
			} else {
				console.log("User listed successfully");
				resolve(data);
			}
		})
	});
}

exports.update = (id, firstname, name, username, email, gender, interest, age, location, bio, photo1, photo2, photo3, photo4, photo5, tags) => {
	return new Promise(async (resolve, reject) => {
		console.log("Starting user update with id "+id);
		const toUpdate = {
			name: name,
			firstname: firstname,
			email: email,
			username: username,
			gender: gender,
			interest: interest,
			age: age,
			location: location,
			bio: bio,
			tags: tags
		};
		if (photo1) {
			toUpdate.photo1 = photo1;
		}
		if (photo2) {
			toUpdate.photo2 = photo2;
		}
		if (photo3) {
			toUpdate.photo3 = photo3;
		}
		if (photo4) {
			toUpdate.photo4 = photo4;
		}
		if (photo5) {
			toUpdate.photo5 = photo5;
		}
		db.query("UPDATE users SET ? WHERE id = ?", [toUpdate, id], (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	});
}

exports.validate = (hash) => {
	return new Promise(async (resolve, reject) => {
		db.query("UPDATE users SET ? WHERE tmp_hash = ?", [{ valide : 1 }, hash], (err, data) => {
			if (err) {
				reject(err);
			} else {
				if (data.changedRows == 1) {
					resolve();
				} else {
					reject("Le compte n'a pas pu être validé. Il l'est probablement déjà.");
				}
			}
		});
	});
}

exports.forgot = (email) => {
	return new Promise( async (resolve, reject) => {
		db.query("SELECT firstname, tmp_hash FROM users WHERE email = ?", [email], (err, data) => {
			if (err) {
				reject(err);
			} else {
				if (!data[0]) {
					reject("Aucun utilisateur ne correspond à cette adresse email");
				} else {
					ejs.renderFile('./templates/forgot.ejs', { firstname: data[0].firstname, host: mainConfig.host, tmp_hash: data[0].tmp_hash }, function (err, data) {
						if (err) {
							reject(err);
						} else {
							mail.sendMail(email, 'Mot de passe oublié sur Matcha', data);
							resolve("Un email vous permettant de créer un nouveau mot de passe vient de vous être envoyé.");
						}
					});
				}
			}
		})
	});
}

exports.reset = (hash, password, confirmation) => {
	return new Promise ( async (resolve, reject) => {
		if (password != confirmation) {
			reject("Le mot de passe et sa confirmation ne correspondent pas");
		}
		const hashpass = await bcrypt.hash(password, 10);
		db.query("UPDATE users SET ? WHERE tmp_hash = ?", [{
			hash: hashpass
		}, hash], (err, data) => {
			if (err) {
				reject(err);
			} else if (data.changedRows == 0) {
				reject("Le mot de passe n'a pas pu être modifié");
			} else {
				resolve("Le mot de passe a bien été modifié");
			}
		})
		resolve();
	});
}
