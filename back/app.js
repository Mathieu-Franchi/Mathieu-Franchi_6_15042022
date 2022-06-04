// pour utiliser le fichier .env pour cacher le compte de la base de donnée
require('dotenv').config();

// On importe express
const express = require('express');

// On creer l'application à l'aide d'express
const app = express();

// importe mongoose/mongodb
const mongoose = require('mongoose');

// import path : pour accéder au chemin d'un dossier statique (ici sur notre pc)
const path = require('path');


// alternative à express.json
// const bodyParser = require('body-parser'); 


// import les routes à l'aide du routeur exporté dans les fichiers routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion base de donnée MONGODB à l'aide du fichier .env (voir .env.sample pour plus d'info) 
mongoose.connect(process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware  : réponse pour n'importe quelle requête
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//alternative à express.json
// app.use(bodyParser.json()); 


// middleware qui intercepte toutes les requêtes qui ont comme Content-Type  application/json pour mettre leur body dans l'objet req
app.use(express.json());

//middleware : permet les requête sur notre dossier statique "images" (sur notre pc) en donnant le chemin du dossier grâce à "path"
app.use('/images', express.static(path.join(__dirname, 'images')));

/* CRUD importé du dossier ROUTES  */

//User
app.use('/api/auth', userRoutes);
//Sauce
app.use('/api/sauces', sauceRoutes);


// on exporte l'app pour y accéder depuis les autres fichier du projet
module.exports = app;