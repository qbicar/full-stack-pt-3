const express = require('express');
const router = express.Router();
const Courses = require('../models').Courses;
const Users = require('../models').Users;
const auth = require('basic-auth')
const bcryptjs = require('bcryptjs');

//<============check credentials and authentication for each user===================== 
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
        console.log('Login Successful')
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.emailAddress}`;
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

//<==========Find all courses that is linked to my database===============
router.get('/courses', asyncHandler(async (req, res) => {
  const course = await Courses.findAll({
    include: [
      {
        model: Users,
        as: "user"
      }]
  })
  res.json(course);
}));

//<==========find my courses with the specific id i am searching for and include the user the course id belongs to
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Courses.findAll({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Users,
        as: "user"
      }]
  })
  res.json(course)
}))

//<===========on courses it will seach for tha authenticated user and they will be able to create a course.
//<===========After course is created it will have an id and also link to their userId in the database=====

router.post('/courses/', async (req, res, next) => {
  try {
    const course = req.body;
    if (req.body.title && req.body.description) {
      const data = await Courses.create(course)
      res.location(`/courses/${data.id}`)
      res.status(201).end();
    } else {
      res.status(400).json({ message: 'Missing Information' })
    }

  }
  catch (error) {
    error.status = 400;
    return next(error)
  };
})

//<===========update my course for the authenticated user================== 
router.put('/courses/:id', async (req, res, next) => {
  try {
    const course = await Courses.findByPk(req.params.id)
      if (req.body.title === '' || req.body.description === '') {
        res.status(400).json({ message: 'Missing Information' })
      } else {
        await course.update(req.body);
        res.status(204).end();
      }
    }catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(403).json({ error: error.message })
    } else {
      return next(error)
    }
  }
});

//<===========delete the course id for the authenticated user==============
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id)
    if (course) {
      await course.destroy();
    } else {
      res.status(404).end();
    }
    res.status(204).end();
  } catch (error) {
    return next(error)
  }

});

module.exports = router;