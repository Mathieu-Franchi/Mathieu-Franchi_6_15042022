// On importe express
const express = require('express');

// On creer l'application à l'aide d'express
const app = express();

// middleware qui intercepte toutes les requêtes qui contiennent du JSON pour le mettre dans req.body
app.use(express.json());

/* MONGODB */
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Mathieu:M4815162342@cluster0.delpt.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("Cluster0").collection("piquante");
  // perform actions on the collection object
  client.close();
});
//Middleware  : réponse pour n'importe quelle requête
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//réponse pour requête de type post
app.post('/api/sauces', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});
//réponse pour requête de type get
app.get('/api/sauces', (req, res, next) => {
  const sauces = [
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(products);
});

//on exporte l'app pour y accéder depuis les autres fichier du projet
module.exports = app;