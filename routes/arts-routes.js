const express = require('express');

const router = express.Router();

const artsControllers = require('../controllers/arts-controllers');

router.get('/:aid', artsControllers.getArtById);

router.get('/user/:uid', artsControllers.getArtByUserId);

module.exports = router;