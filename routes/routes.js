const express = require('express');
const bodyParser = require('body-parser');

const url = require('url');
const jobModel = require('../model/models');

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

//View all jobs
app.get('/manage-jobs', async (req, res) => {
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
});

// Search job
app.get('/manage-jobs/:title', async (req, res) => {
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
app.get('/manage-jobs/cities', async (req, res) => {
  const para = req.query;
  console.log(para);
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

//Add new job
app.post('/manage-job/', async (req, res) => {
  const job = new jobModel(req.body);
  try {
    await job.save();
    res.send(message(200, 'OK', `Job successfully added!`, job));
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

// Delete job
app.delete('manage-job/:title', async (req, res) => {
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

//List all jojb city wise
app.get('/manage-jobs/cities', async (req, res) => {
  try {
    const job = await jobModel.aggregate([{ $group: { _id: "$city", "data": { "$push": "$$ROOT" } } }]);
    if (job.length != 0) {
      res.send(message(200, 'OK', 'Job Found!', job));
    } else {
      res.send(message(400, 'bad request', 'There are currently no job exists!'));
    }
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

module.exports = app