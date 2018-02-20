
const userModel = require('../models/user.js');

module.exports = {

	signUp: (req, res) => {
		const output = {};
		if (!req.body.firstname || !req.body.name || !req.body.username || !req.body.email || !req.body.pass || !req.body.conf || !req.body.gender) {
			output.error = "Merci de renseigner tous les champs";
		} else {
			try {
				userModel.signUp(req.body.firstname, req.body.name, req.body.username, req.body.email, req.body.pass, req.body.conf, req.body.gender);
			} catch(e) {
				output.error = e;
			}
		}
		return output;
	},

	signIn: async (req, res) => {
		return new Promise(async (resolve, reject) => {
			console.log("Entering signin process");
			if (!req.body.email || !req.body.password) {
				throw new Error("Missing fields");
				reject("Error");
			} else {
				try {
					const id = await userModel.signIn(req.body.email, req.body.password);
					if (id) {
						req.session.userId = id;
						resolve(id);
					} else {
						reject(new Error("Informations de connexion incorrectes"));
					}
				} catch (e) {
					reject(e);
				}
			}
		});
	},

	get: (req, res) => {
		return new Promise(async (resolve, reject) => {
			if (!req.params.id && !req.session.userId) {
				reject(new Error("Aucun utilisateur pointé"));
			}
			try {
				data = await userModel.get((req.params.id)?req.params.id:req.session.userId);
				resolve(data);
			} catch(e) {
				reject(e);
			}
		})
	},

	update: (req, res) => {
		return new Promise(async (resolve, reject) => {
			try {
				await userModel.update(
					req.session.userId,
					req.body.firstname,
					req.body.name,
					req.body.gender,
					req.body.interest,
					req.body.age,
					req.body.location,
					req.body.bio
				);
				resolve();
			} catch(e) {
				reject(e);
			}
		});
	}
}
