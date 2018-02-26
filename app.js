const express = require('express');
const app = express();
const http = require('http').Server(app)
const bodyParser = require('body-parser');
const session = require('express-session');
const database = require('./config/database.js');
const db = database.db;
const notifModel = require('./models/notif.js');
const messageModel = require('./models/message.js');
const io = require('socket.io')(http);

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
const chat = require('./routes/chat.js');

// Appel des routeurs

app.use('/auth', auth);
app.use('/user', user);
app.use('/chat', chat);
app.use('/like', like);

// Routes de base

app.get('/', async (req, res) => {
	const data = {};
	if (req.session.userId) {
		data.notifs = await notifModel.get(req.session.userId);
		data.userId = req.session.userId;
	}
	res.render('home', data);
});

// Socket.IO

let online = [];

io.on('connection', (socket) => {
	let me = null;
	socket.on('login', (user) => {
		online[user.userId] = socket.id;
		console.log(online);
		me = user.userId;
		io.sockets.emit('login', {
			id: user.userId
		});
	});

	socket.on('message', async (opts) => {
		if (online[opts.to]) {
			await messageModel.create(opts.from, opts.to, opts.content, 1);
			io.sockets.to(online[opts.to]).emit('message', {
				content: opts.content
			});
		} else {
			await messageModel.create(opts.from, opts.to, opts.content, 0);
		}
	});
	online.map((e, id) => {
		if (e) {
			socket.emit('login', {
				id: id
			});
		}
	});

	socket.on('disconnect', () => {
		if (me) {
			delete online[me];
			console.log(online);
			io.sockets.emit('logout', {
				id: me
			});
		}
	})
})

// Démarrage du serveur

http.listen(8080, () => {
	console.log('Matcha started on port 8080');
});
