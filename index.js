const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');

const port = process.env.port || 5000;
const app = express();

//Here json will comes as an output this just make sures it.
app.use(express.json());

mongoose.connect('mongodb://localhost/dbJob', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(routes);

app.listen(port, () => { console.log('Server started ...') });
