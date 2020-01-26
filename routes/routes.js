const express = require('express');
const jobModel = require('../model/models');
const bodyParser = require('body-parser');
const app = express();

//Taken body parser since using post method and to pass its body this requires.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//View all jobs
app.get('/viewJob',async (req,res) => {
    const job = await jobModel.find({});
    try {
        if (job.length != 0) {
            res.send(job);
        } else {
            res.send('There are currently no job exists!');
        }
    } catch (err) {
        res.send(500).send(err);
    }
});

//Search job
app.get('/searchJob/:title',async (req,res) => {
    const para = req.params.title;
    const job = await jobModel.find({title:para});
    try {
        if (job.length != 0) {
            res.send(job);
        } else {
            res.send('There is no such job exists!');
        }
        
    } catch (err) {
        res.send(500).send(err);
    }
});

//City-wise search
app.get('/searchJob/city/:city',async (req,res) => {
    const para = req.params.city;
    const job = await jobModel.find({city:para});
    try {
        if (job.length != 0) {
            res.send(job);
        } else {
            res.send(`There are no such job exists from ${para} city`);
        }
    } catch (err) {
        res.send(500).send(err);
    }
});

//Add new job
app.post('/addJob',async (req,res) => {
    const job = new jobModel(req.body);
    try {
        await job.save();
        res.send(job);
    } catch (err) {
        res.send(500).send(err);
    }
});

module.exports = app