const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const userModel = require('../model/userModels');
const jobModel = require('../model/models');

function verifyToken(req, res, next) {
  const bodyHeader = req.headers['authorization'];
  if(typeof bodyHeader != 'undefined') {
    const requestBody = bodyHeader.split(' ');
    const headerToken = requestBody[1];
    req.token = headerToken;
    next();
  } else {
    res.send('Token is invalid')
  }
}

function message(statusCode, status, msg, data = '') {
  let obj = {
    statusCode: statusCode,
    status: status,
    message: msg,
    data: data
  }
  return obj;
}

const app = express();
// Taken body parser since using post method and to pass its body this requires.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// View all jobs
app.get('/jobs', verifyToken ,async(req, res) => {
  jwt.verify(req.token, 'secret', async (err, auth) => {
    if(err) {
      res.sendStatus(403);
    } else {
      try {
        const job = await jobModel.find({});
        if (job.length != 0) {
          res.send(message(200, 'OK', 'Job added successfully', job));
        } else {
          res.send(message(400, 'bad request', 'There are currently no job exists!'));
        }
      } catch (err) {
        res.sendStatus(500).send(err);
      }
    }
  });
  
});

// Search job
app.get('/jobs/:title', async (req, res) => {
  const para = req.params.title;
  try {
    const job = await jobModel.find({ title: para });
    if (job.length != 0) {
      res.send(message(200, 'OK', 'Job found!', job));
    } else {
      res.send(message(400, 'bad request', `${para} is not exists!`));
    }
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

// City-wise search
app.get('/job/from', async (req, res) => {
  const para = req.query.city;
  try {
    const job = await jobModel.find({ city: para });
    if (job.length != 0) {
      res.send(message(200, 'OK', `Job found from ${para} city!`, job));
    } else {
      res.send(message(400, 'bad request', `There are no such job exists from ${para} city`));
    }
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

// Add new job
app.post('/job/', async (req, res) => {
  const job = new jobModel(req.body);
  try {
    await job.save();
    res.send(message(200, 'OK', `Job successfully added!`, job));
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

// Delete job
app.delete('job/:title', async (req, res) => {
  const para = req.params.title;
  const findJob = await jobModel.find({ title: para });
  try {
    if (findJob.length != 0) {
      await jobModel.deleteOne({ title: para });
      res.send(message(200, 'OK', `${para} is deleted successfully!`, findJob));
    } else {
      res.send(message(400, 'bad request', `${para} is not found!`));
    }
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

// List all jojb city wise
app.get('/jobs/cities/all', async (req, res) => {
  try {
    const job = await jobModel.aggregate([{ $group: { _id: "$city", "data": { "$push": "$$ROOT" } } }]);
    console.log(job);
    if (job.length != 0) {
      res.send(message(200, 'OK', 'Job Found!', job));
    } else {
      res.send(message(400, 'bad request', 'There are currently no job exists!'));
    }
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

app.post('/login',async (req,res) => {
  const em = req.body.email;
  const pwd = req.body.password;
  try {
    const user = await userModel.find({$and:[{email: em}, {password: pwd}] });
    let reqData = req.body;
    if (user.length != 0) {
      jwt.sign({reqData},'secret',(err, token) => {
        res.json({
          token
        })
      });
    } else {
      res.send(message(400, 'bad request', `There are no such user exists`));
    }
  } catch (err) {
    res.sendStatus(500).send(err);
  }
  //let reqData = req.body;
  
});

// Add new user
app.post('/add-user', async (req, res) => {
  const users = new userModel(req.body);
  try {
    await users.save();
    res.send(message(200, 'OK', `User successfully added!`, users));
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

module.exports = app