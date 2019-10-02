const express = require('express');
const router = express.Router();
const data = require('../seed/data.json').users;
const Users = require('../models').Users;
const auth = require('basic-auth')
const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//<===========check credentials and authentication for each user===================== 
const authenticatedUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  if (credentials) {
    const user = await Users.findOne({ where: { emailAddress: credentials.name } });
    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
      if (authenticated) {
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}}`;
      }
    } else {
      message = `User not found for username: ${credentials.emailAddress}}`;
    }
  } else {
    message = 'Auth header not found';
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

//<==========handles errors in async function ============================
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}
//<============on /users , user must sign in with credentials and format is returned with user information
router.get('/users', authenticatedUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.json(
    user
  )
  return res.status(200).end();
}));
//<===========post user ,creates a new user and hashes their created password to database for security purposes
router.post('/users', async (req, res) => {
  try {
    const user = req.body;
    if (user.password && user.firstName && user.lastName && user.emailAddress) {
      req.body.password = bcryptjs.hashSync(req.body.password)
      await Users.create(user)
      res.location('/').status(201).end();
    } else {
      res.status(400).json({ message: 'Missing Information' }).end();
    }
  }
  catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.json(error.errors)
      console.error('Validation error:', errors)
    } else {
      throw error;
    }
  };
});


module.exports = router;