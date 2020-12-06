const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Art = require('../models/art');

let DUMMY_ARTS = [
    {
      id: 'p1',
      title: 'Art 1',
      description: 'One of the most famous painting in the world!',
      imageUrl: 'https://res.cloudinary.com/vishesh123/image/upload/v1598877183/m18lqtmbvsvrqswlcmmj.jpg',
      address: 'Agra, U.P., India',
      location: {
        lat: 27.1767,
        lng: 78.0081
      },
      creator: 'u1'
    },
    {
      id: 'p2',
      title: 'Art 2',
      description: 'Another famous painting in the world!',
      imageUrl: 'https://res.cloudinary.com/vishesh123/image/upload/v1598880593/nh5xl27vna1r0xsweqk9.png',
      address: 'Mumbai, Maharastra, India',
      location: {
        lat: 19.07,
        lng: 72.87
      },
      creator: 'u2'
    }
  ];

  const getArtById = (req, res, next) => {
    const artId = req.params.aid; 
    const art = DUMMY_ARTS.find(a => {
      return a.id === artId;
    });
    if (!art) {
      throw new HttpError('Could not find art for the provided Art Id.', 404);
    }
    res.json({ art });
  }

  const getArtsByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const arts = DUMMY_ARTS.filter(a => {
      return a.creator === userId;
    });
    if (!arts || arts.length === 0) {
      throw new HttpError('Could not find arts for the provided User Id.', 404);
    }
    res.json({ arts });
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

  const updateArt = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { title, description } = req.body;
    const artId = req.params.pid;
  
    const updatedArt = { ...DUMMY_ARTS.find(p => p.id === artId) };
    const artIndex = DUMMY_ARTS.findIndex(p => p.id === artId);
    updatedArt.title = title;
    updatedArt.description = description;
  
    DUMMY_ARTS[artIndex] = updatedArt;
  
    res.status(200).json({art: updatedArt});
  };

  const deleteArt = (req, res, next) => {
    const artId = req.params.pid;
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
      throw new HttpError('Could not find a place for that id.', 404);
    }
    DUMMY_ARTS = DUMMY_ARTS.filter(p => p.id !== artId);
    res.status(200).json({ message: 'Deleted Art.' });
  };
  
exports.getArtById = getArtById;
exports.getArtsByUserId = getArtsByUserId;
exports.createArt = createArt;
exports.updateArt = updateArt;
exports.deleteArt = deleteArt;