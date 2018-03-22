
const userModel = require('../models/user.js');
const tagModel = require('../models/tag.js');
const likeModel = require('../models/like.js');
const notifModel = require('../models/notif.js')

module.exports = {

	signUp: async (req, res) => {
		const output = {};
		if (!req.body.firstname || !req.body.name || !req.body.username || !req.body.email || !req.body.pass || !req.body.conf || !req.body.gender) {
			output.error = "Merci de renseigner tous les champs";
			output.name = req.body.name;
			output.firstname = req.body.firstname;
			output.username = req.body.username;
			output.email = req.body.email;
			output.gender = req.body.gender;
		} else {
			try {
				await userModel.signUp(req.body.firstname, req.body.name, req.body.username, req.body.email, req.body.pass, req.body.conf, req.body.gender);
				return res.redirect('/auth/signin/ok');
			} catch(e) {
				output.error = e;
				output.name = req.body.name;
				output.firstname = req.body.firstname;
				output.username = req.body.username;
				output.email = req.body.email;
				output.gender = req.body.gender;
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
				data.notifs = await notifModel.get(req.session.userId);
				data.likes = await likeModel.get((req.params.id)?req.params.id:req.session.userId,(req.params.id)?req.params.id:req.session.userId);
				data.like = false;
				data.liked = false;
				data.likes.map((e) => {
					if (e.target == req.session.userId) { data.liked = true; }
					if (e.owner == req.session.userId) { data.like = true; }
				})
				resolve(data);
			} catch(e) {
				reject(e);
			}
		})
	},

	update: (req, res) => {
		return new Promise(async (resolve, reject) => {
			if (req.body.password && !req.body.confirmation) {
				reject('Veuillez confirmer votre nouveau mot de passe');
			}
			try {
				await userModel.update(
					req.session.userId,
					req.body.firstname,
					req.body.name,
					req.body.username,
					req.body.password,
					req.body.confirmation,
					req.body.email,
					req.body.gender,
					req.body.interest,
					req.body.age,
					req.body.location,
					req.body.bio,
					(req.files.photo1)?req.files.photo1[0].filename:null,
					(req.files.photo2)?req.files.photo2[0].filename:null,
					(req.files.photo3)?req.files.photo3[0].filename:null,
					(req.files.photo4)?req.files.photo4[0].filename:null,
					(req.files.photo5)?req.files.photo5[0].filename:null,
					req.body.tags
				);
				await tagModel.save(req.body.tags);
				resolve();
			} catch(e) {
				reject(e);
			}
		});
	},

	getAll: (req, res) => {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await userModel.getAll(req.session.userId);
				resolve(data);
			} catch(e) {
				reject(e);
			}
		});
	},

	getFiltered: (req, res) => {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await userModel.getFiltered(req.session.userId, req.body.ageMin, req.body.ageMax, req.body.popMin, req.body.popMax, req.body.tags, req.body.range);
				resolve(data);
			} catch(e) {
				reject(e);
			}
		});
	},

	validate: async (req, res) => {
		try {
			await userModel.validate(req.params.hash);
			return {};
		} catch (e) {
			return { error : e };
		}
	},

	forgot: async (req, res) => {
		if (!req.body.email) {
			return { error: "Veuillez entrer votre adresse email" }
		}
		try {
			return { message : await userModel.forgot(req.body.email) }
		} catch (e) {
			return { error: e }
		}
	},

	reset: async (req, res) => {
		if (!req.body.hash) {
			return { error: "Le lien de récuération de mot de passe est incorrecte" }
		}
		if (!req.body.password || !req.body.confirmation) {
			return { error: "Veuillez renseigner tous les champs" }
		}
		try {
			await userModel.reset(req.body.hash, req.body.password, req.body.confirmation);
			res.redirect("/auth/signin/resetok");
		} catch (e) {
			return { error : e }
		}
	}
}
