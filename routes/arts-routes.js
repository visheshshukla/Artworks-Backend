const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const artsControllers = require('../controllers/arts-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/:aid', artsControllers.getArtById);

router.get('/user/:uid', artsControllers.getArtsByUserId);

router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
    [
      check('title')
        .not()
        .isEmpty(),
      check('description').isLength({ min: 5 }),
      check('address')
        .not()
        .isEmpty()
    ],
    artsControllers.createArt
  );
  
  router.patch(
    '/:pid',
    [
      check('title')
        .not()
        .isEmpty(),
      check('description').isLength({ min: 5 })
    ],
    artsControllers.updateArt
  );

router.delete('/:pid', artsControllers.deleteArt);

module.exports = router;