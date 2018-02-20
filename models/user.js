
const database = require('../config/database.js');
const bcrypt = require('bcrypt');
const db = database.db;

db.connect();

exports.signup = async (fname, name, uname, email, pass, conf) => {
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
		hash: hash
	}, (err, res) => {
		if (err) {
			throw err;
		}
	});
}
