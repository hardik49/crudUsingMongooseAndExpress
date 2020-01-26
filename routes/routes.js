const express = require('express');
const jobModel = require('../model/models');
const bodyParser = require('body-parser');
const app = express();

//Taken body parser since using post method and to pass its body this requires.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/addJob',async (req,res) => {
    const job = new jobModel(req.body);
    try {
        await job.save();
        res.send(job);
        console.log("Job record inserted");
    } catch (err) {
        res.send(500).send(err);
    }
});

module.exports = app