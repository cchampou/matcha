
const database = require('../config/database.js');
const bcrypt = require('bcrypt');
const db = database.db;

db.connect();

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
		db.query("SELECT id, name, firstname, username, gender, interest, bio, images, age, location, pop FROM users WHERE id = ?", [id], (err, data) => {
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

exports.update = (id, firstname, name, gender, interest, age, location, bio) => {
	return new Promise(async (resolve, reject) => {
		console.log("Starting user update with id "+id);
		db.query("UPDATE users SET ?", {
			name: name,
			firstname: firstname,
			gender: gender,
			interest: interest,
			age: age,
			location: location,
			bio: bio
		}, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	});
}
