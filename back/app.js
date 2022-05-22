require('dotenv').config();
// On importe express
const express = require('express');
// On creer l'application à l'aide d'express
const app = express();

const mongoose = require('mongoose');
const path = require('path');
// alternative à express.json
// const bodyParser = require('body-parser'); 

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

/* MONGODB */
mongoose.connect(process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Middleware  : réponse pour n'importe quelle requête
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// middleware qui intercepte toutes les requêtes qui ont comme Content-Type  application/json pour le mettre leur body dans l'objet req
app.use(express.json());

// CRUD importé du dossier ROUTES et Modification enregistré dans notre base de donnée

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

/******* 
alternative à express.json
app.use(bodyParser.json()); 
********/
app.use('images', express.static(path.join(__dirname, 'images')));

// on exporte l'app pour y accéder depuis les autres fichier du projet
module.exports = app;