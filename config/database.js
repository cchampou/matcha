const mysql = require('mysql');

exports.db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'b8gt5k98c',
	database: 'matcha'
});
