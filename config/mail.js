const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
	host: 'ssl0.ovh.net',
	port: 465,
	secure: true,
	auth: {
		user: 'matcha@champouillon.com',
		pass: 'b8gt5k98c'
	}
});

exports.sendMail = (to, subject, content) => {

	const message = {
		from: 'matcha@champouillon.com',
		to: to,
		subject: subject,
		html: content
	}

	mailer.sendMail(message);

}
