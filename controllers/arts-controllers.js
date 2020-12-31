const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Art = require('../models/art');
const User = require('../models/user');

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
      return next(
      new HttpError('Could not find art for the provided Id.', 404)
      );
    }
    res.json({ art: art.toObject({ getters: true }) });
  }

  const getArtsByUserId = async(req, res, next) => {
    const userId = req.params.uid;

    let userWithArts
    try {
      userWithArts = await User.findById(userId).populate('arts');
    } catch (err) {
      const error = new HttpError(
        'Fetching arts failed, please try again later',
        500
      );
      return next(error);
    }

    if (!userWithArts) {
      return next(
      new HttpError('Could not find arts for the provided User Id.', 404)
      );
    }
    res.json({ arts: userWithArts.arts.map(art => art.toObject({ getters: true })) });
  }

  const createArt = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next (new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { title, description, address } = req.body;

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
      image: req.file.path,
      creator: req.userData.userId
    });

    let user;

    try {
      user = await User.findById(req.userData.userId);
    } catch (err) {
      const error = new HttpError(
        'Creating art failed, please try again',
        500
      );
      return next(error);
    }

    if(!user) {
      const error = new HttpError('Could not find user for the provided Id', 404);
      return next(error);
    }
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdArt.save( { session: sess });
      user.arts.push( createdArt );
      await user.save({ session: sess });
      await sess.commitTransaction();
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

    if(art.creator.toString() !== req.userData.userId){
      const error = new HttpError(
        'You are not allowed to update this art.',
        401
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
      art = await Art.findById(artId).populate('creator');
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete art.',
        500
      );
      return next(error);
    }

    if (!art) {
      const error = new HttpError('Could not find art for this ID.',404);
      return next(error);
    }

    if(art.creator.id !== req.userData.userId){
      const error = new HttpError(
        'You are not allowed to delete this art.',
        401
      );
      return next(error);
    }

    const imagePath = art.image;
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await art.remove({ session: sess });
      art.creator.arts.pull( art );
      await art.creator.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete art.',
        500
      );
      return next(error);
    }

    fs.unlink(imagePath,err => {
      if(err!=null)
      {
        console.log(err);
      }
    });

    res.status(200).json({ message: 'Deleted art.' });
  };
  
exports.getArtById = getArtById;
exports.getArtsByUserId = getArtsByUserId;
exports.createArt = createArt;
exports.updateArt = updateArt;
exports.deleteArt = deleteArt;