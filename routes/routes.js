const express = require('express');
const jwt = require('jsonwebtoken');

const jobAuth = require('../controller/JobController');
const userAuth = require('../controller/AuthController');

const router = express.Router();

function verifyToken(req, res, next) {
  const bodyHeader = req.headers['authorization'];
  if (typeof bodyHeader != 'undefined') {
    jwt.verify(bodyHeader, 'secret', (err, decoded) => {
      if (err) res.json({ status: false, message: 'Invalid token' });
      next();
    });
  } else {
    res.send('Invalid Token');
  }
}

// View all jobs
router.get('/jobs', verifyToken,jobAuth.getJobs);

// Add new job
router.post('/job', verifyToken, jobAuth.addNewJob);

// Delete job
router.delete('job/:title', verifyToken, jobAuth.deleteJob);

// Add new user
router.post('/user', userAuth.registerUser);

// Login User
router.post('/login', userAuth.authenticate);

module.exports = router;
