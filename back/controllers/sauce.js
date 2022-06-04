const Sauce = require('../models/Sauce');
const fs = require('fs');
/*---------------- CRUD -----------------*/
//post
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    
    //delete le faux _id envoyé par le front-end
    delete sauceObject._id;
    //creer une nouvelle sauce par rapport aux champs recupérer dans le corps de la requète
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:  0 ,
        dislikes:  0 
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};
//put
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};
//delete
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
//get one
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};
//get all
exports.getAllSauces = (req, res, next) => {
    //récupère toutes les sauces de la base de donnée
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// LIKE DISLIKE
exports.likeSauces = (req, res, next) => {
    //const pour simplifier la lisibilitée du code
    const like = req.body.like;
    const sauceId = req.params.id;
    const userId = req.body.userId;
    //on trouve la sauce grace à l'id recupéré dans l'url du front
    Sauce.findOne({ _id: sauceId })
    .then(function (sauce) {
      switch (like) {
        // L'utilisateur aime la sauce 
        case 1:
          //verifie si l'user n'est pas déjà dans le tableau des users ayant liké
          if (!sauce.usersLiked.includes(userId) && like === 1) {
            //si userId n'est pas inclus  et que le front renvoie like = 1
            Sauce.updateOne({ _id: sauceId },
              { //on incrémente les likes et on push userId dans le tableau des users ayant liké
                $inc: { likes: 1 }, $push: { usersLiked: userId }
              })
              .then(function () {
                res.status(201).json({ message: "like" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          break;
        // L'utilisateur n'aime pas la sauce 
        case -1:
          if (!sauce.usersDisliked.includes(userId) && like === -1) {
            Sauce.updateOne({ _id: sauceId },
              { $inc: { dislikes: 1 }, $push: { usersDisliked: userId }, }
            )
              .then(function () {
                res.status(201).json({ message: "dislike" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          break;
        // Annulation du like par l'utilisateur
        case 0:
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne({ _id: sauceId },
              { $inc: { likes: -1 }, $pull: { usersLiked: userId }, }
            )
              .then(function () {
                res.status(201).json({ message: "like annulé" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          // Annulation du dislike 
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }, }
            )
              .then(function () {
                res.status(201).json({ message: "dislike annulé" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          break;
      }
    })
    .catch(function (error) {
      res.status(404).json({ error: error });
    });
};
    



