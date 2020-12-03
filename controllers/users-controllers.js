const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Vishesh Shukla',
    email: 'test@test.com',
    password: 'test123'
  }
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);
  }

  const createdUser = {
    id: uuidv4(),
    name, 
    email,
    password
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({user: createdUser});
};

exports.getUsers = getUsers;
exports.signup = signup;
