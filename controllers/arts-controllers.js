const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Art = require('../models/art');

  const getArtById = async(req, res, next) => {
    const artId = req.params.aid; 

    let art;
    try {
      art = await Art.findById(artId);
    } catch (err) {
      const error = new HttpError(
        'Fetching art failed, please try again later',
        500
      );
      return next(error);
    }
    if (!art) {
      throw new HttpError('Could not find art for the provided Id.', 404);
    }
    res.json({ art: art.toObject({ getters: true }) });
  }

  const getArtsByUserId = async(req, res, next) => {
    const userId = req.params.uid;

    let arts;
    try {
      arts = await Art.find({ creator: userId });
    } catch (err) {
      const error = new HttpError(
        'Fetching arts failed, please try again later',
        500
      );
      return next(error);
    }

    if (!arts || arts.length === 0) {
      return next(
      new HttpError('Could not find arts for the provided User Id.', 404)
      );
    }
    res.json({ arts: arts.map(art => art.toObject({ getters: true })) });
  }

  const createArt = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next (new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

    const createdArt = new Art({
      title,
      description,
      address,
      location: coordinates,
      image: 'https://res.cloudinary.com/vishesh123/image/upload/v1598877183/m18lqtmbvsvrqswlcmmj.jpg',
      creator
    });
  
    try {
      await createdArt.save();
    } catch (err) {
      const error = new HttpError(
        'Creating art failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json({art: createdArt});
  };

  const updateArt = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }

    const { title, description } = req.body;
    const artId = req.params.pid;
    
    let art;
    try {
      art = await Art.findById(artId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update art.',
        500
      );
      return next(error);
    }
  
    art.title = title;
    art.description = description;
  
    try {
      await art.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update art.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ art: art.toObject({ getters: true }) });
  };

  const deleteArt = async(req, res, next) => {
    const artId = req.params.pid;
    
    let art;
    try {
      art = await Art.findById(artId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete art.',
        500
      );
      return next(error);
    }
  
    try {
      await art.remove();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete art.',
        500
      );
      return next(error);
    }

    res.status(200).json({ message: 'Deleted Art.' });
  };
  
exports.getArtById = getArtById;
exports.getArtsByUserId = getArtsByUserId;
exports.createArt = createArt;
exports.updateArt = updateArt;
exports.deleteArt = deleteArt;