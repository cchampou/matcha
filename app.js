const express = require('express');
const app = express();

// Définition du moteur de vues

app.set('view engine', 'ejs');

// Service des fichiers statiques

app.use(express.static('public'));

// Chargement des routeurs

const auth = require('./routes/auth.js');
const user = require('./routes/user.js');

// Routage

app.use('/auth', auth);
app.use('/user', user);

app.get('/', (req, res) => {
	res.render('home');
});

// Démarrage du serveur

app.listen(3000, () => {
	console.log('Matcha started on port 3000');
});
