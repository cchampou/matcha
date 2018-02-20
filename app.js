const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

// Express settings

app.disable('x-powered-by');

// Parsing request

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

// Chargement des routeurs

const auth = require('./routes/auth.js');
const user = require('./routes/user.js');
const chat = require('./routes/chat.js');

// Appel des routeurs

app.use('/auth', auth);
app.use('/user', user);
app.use('/chat', chat);

// Routes de base

app.get('/', (req, res) => {
	const data = {};
	data.userId = req.session.userId;
	res.render('home', data);
});

// Démarrage du serveur

app.listen(3000, () => {
	console.log('Matcha started on port 3000');
});
