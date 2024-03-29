const express = require('express');
const app = express();
const http = require('http').Server(app)
const bodyParser = require('body-parser');
const session = require('express-session');
const database = require('./config/database.js');
const db = database.db;
const notifModel = require('./models/notif.js');
const messageModel = require('./models/message.js');
const socketIO = require('./sockets.js').init(http);


db.connect();

// Express settings

app.disable('x-powered-by');

// Session middleware

app.use(session({
	resave: false,
	secret: 'atomizer',
	saveUninitialized: true
}));

// Définition du moteur de vues

app.set('view engine', 'ejs');

// Service des fichiers statiques

app.use(express.static('public'));

// Parsing request

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Chargement des routeurs

const auth = require('./routes/auth.js');
const user = require('./routes/user.js');
const like = require('./routes/like.js');
const block = require('./routes/block.js');
const chat = require('./routes/chat.js');

// Appel des routeurs

app.use('/auth', auth);
app.use('/user', user);
app.use('/chat', chat);
app.use('/like', like);
app.use('/block', block);

// Routes de base

app.get('/', async (req, res) => {
	const data = {};
	if (req.session.userId) {
		data.notifs = await notifModel.get(req.session.userId);
		data.newmessages = await messageModel.getUnread(req.session.userId);
		data.userId = req.session.userId;
	}
	res.render('home', data);
});

// Démarrage du serveur

http.listen(8080, () => {
	console.log('Matcha started on port 8080');
});
