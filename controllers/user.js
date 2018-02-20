
const userModel = require('../models/user.js');

exports.signup = (req, res) => {
	const output = {};
	if (!req.body.firstname || !req.body.name || !req.body.username || !req.body.email || !req.body.pass || !req.body.conf) {
		output.error = "Merci de renseigner tous les champs";
	} else {
		try {
			userModel.signup(req.body.firstname, req.body.name, req.body.username, req.body.email, req.body.pass, req.body.conf);
		} catch(e) {
			output.error = e;
		}
	}
	return output;
}
