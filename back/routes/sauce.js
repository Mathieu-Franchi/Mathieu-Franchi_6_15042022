const express = require('express');
const router = express.Router();
//importe le model de notre objet ici sauce
const sauceCtrl = require('../controllers/sauce')

const auth = require('../middleware/auth')

/*---------------- CRUD -----------------*/
//réponse pour requête de type post
router.post('/', auth, sauceCtrl.createSauce);
  
//requête de type put pour modifier l'objet
router.put('/:id', auth, sauceCtrl.modifySauce);
  
//requête de type delete pour supprimer l'objet
router.delete('/:id', auth, sauceCtrl.deleteSauce);
  
//réponse pour requête de type get
router.get('/:id', auth, sauceCtrl.getOneSauce);

//réponse pour requête de type get all
router.get('/', auth, sauceCtrl.getAllSauces);
  
  
//on exporte le router pour y accéder depuis les autres fichier du projet
module.exports = router;
