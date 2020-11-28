const express = require('express');

const router = express.Router();

const DUMMY_ARTS = [
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

router.get('/:aid', (req, res, next) => {
  const artId = req.params.aid; 
  const art = DUMMY_ARTS.find(a => {
    return a.id === artId;
  });
  if (!art) {
    const error = new Error('Could not find art for the provided id.');
    error.code = 404;
    throw error;
  }
  res.json({art});
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const art = DUMMY_ARTS.find(a => {
    return a.creator === userId;
  });
  if (!art) {
    const error = new Error('Could not find art for the provided user id.');
    error.code = 404;
    return next(error);
  }
  res.json({ art });
});

module.exports = router;