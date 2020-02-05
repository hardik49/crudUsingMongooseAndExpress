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
async function getJobs(req, res) {
  if (req.query.city === undefined && req.query.title === undefined) {
    try {
      const job = await jobModel.find({});
      if (job.length !== null) {
        res.send(message(200, 'OK', 'Job Found!', job));
      } else {
        res.send(message(400, 'bad request', 'There are currently no job exists!'));
      }
    } catch (err) {
      res.sendStatus(500).send(err);
    }
  } else if (req.query.city) {
    const para = req.query.city;
    try {
      const job = await jobModel.find({ city: para });
      if (job.length !== null) {
        res.send(message(200, 'OK', `Job found from ${para} city!`, job));
      } else {
        res.send(message(400, 'bad request', `There are no such job exists from ${para} city`));
      }
    } catch (err) {
      res.sendStatus(500).send(err);
    }
  } else if (req.query.title) {
    const para = req.query.title;
    try {
      const job = await jobModel.find({ title: para });
      if (job.length !== null) {
        res.send(message(200, 'OK', 'Job found!', job));
      } else {
        res.send(message(400, 'bad request', `${para} is not exists!`));
      }
    } catch (err) {
      res.sendStatus(500).send(err);
    }
  }
}

async function findJobCitywise(req, res) {
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
}

async function addNewJob(req, res) {
  const job = new jobModel(req.body);
  try {
    const insert = await job.save();
    res.send(message(200, 'OK', `Job successfully added!`, insert));
  } catch (err) {
    res.sendStatus(500).send(err);
  }
}

async function deleteJob(req, res) {
  const para = req.params.title;
  const findJob = await jobModel.find({ title: para });
  try {
    if (findJob !== null) {
      const deleted = await jobModel.deleteOne({ title: para });
      res.send(message(200, 'OK', `${para} is deleted successfully!`, deleted));
    } else {
      res.send(message(400, 'bad request', `${para} is not found!`));
    }
  } catch (err) {
    res.sendStatus(500).send(err);
  }
}

module.exports = {
   addNewJob, deleteJob, getJobs, findJobCitywise,message
}