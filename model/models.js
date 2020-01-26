const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
Made job collection schema.
Here by making verion key false will not take __v field in job collection.
*/
const JobSchema = new Schema({
    title: String,
    department: String,
    city: String,
    salary: String
},{versionKey: false}) 

//"jobs" is a collection name need to be considered here. 
const jobs = mongoose.model('jobs', JobSchema);

module.exports = jobs;