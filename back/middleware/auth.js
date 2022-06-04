//import json.web.token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try { //methode split creer un tableau sur une chaine de caractère et sépare les elements entre les espaces
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = { userId };
        //si on a un userId dans le corps de la requête et qu'il est différent du userId decodé
        if (req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable !';

        }
        else {
            next();
        }
    }
    catch (error) {
        res.status(401).json({error: error | 'Requête non authentifiée !'});
    }
};