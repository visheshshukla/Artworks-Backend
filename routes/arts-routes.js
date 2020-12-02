const express = require('express');

const router = express.Router();

const artsControllers = require('../controllers/arts-controllers');

router.get('/:aid', artsControllers.getArtById);

router.get('/user/:uid', artsControllers.getArtsByUserId);

router.post('/', artsControllers.createArt);

router.patch('/:pid', artsControllers.updateArt);

router.delete('/:pid', artsControllers.deleteArt);

module.exports = router;