const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes/routes');
const port = process.env.port || 5000;

const app = express();
//Here json will comes as an output this just make sures it.
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(routes);
app.listen(port, () => { console.log('Server started ...') });

