const express = require('express');

const router = express.Router();

const artsControllers = require('../controllers/arts-controllers');

router.get('/:aid', artsControllers.getArtById);

router.get('/user/:uid', artsControllers.getArtByUserId);

router.post('/', artsControllers.createArt);

module.exports = router;