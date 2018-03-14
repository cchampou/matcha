
const database = require('../config/database.js');
const bcrypt = require('bcrypt');
const db = database.db;

exports.signUp = async (fname, name, uname, email, pass, conf, gender) => {
	if (pass.length < 8) {
		throw "Le mot de passe doit contenir au moins 8 caracteres";
	}
	if (pass != conf) {
		throw "Le mot de passe et sa confirmation ne correspondent pas";
	}
	const hash = await bcrypt.hash(pass, 10);
	db.query("INSERT INTO users SET ?", {
		firstname: fname,
		name: name,
		username: uname,
		email: email,
		hash: hash,
		gender: gender
	}, (err, res) => {
		if (err) {
			throw err;
		}
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
		db.query("SELECT id, name, firstname, username, gender, interest, bio, photo1, photo2, photo3, photo4, photo5, age, location, pop, tags FROM users WHERE id = ?", [id], (err, data) => {
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

exports.block = (from, to) => {
	return new Promise((resolve, reject) => {
		console.log("Starting blocking user");
		db.query("INSERT INTO blocks SET ?", {
			owner: from,
			target: to
		}, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	})
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

exports.update = (id, firstname, name, username, gender, interest, age, location, bio, photo1, photo2, photo3, photo4, photo5, tags) => {
	return new Promise(async (resolve, reject) => {
		console.log("Starting user update with id "+id);
		const toUpdate = {
			name: name,
			firstname: firstname,
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
