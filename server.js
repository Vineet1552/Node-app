//server.js

const express = require('express');
const app = express();
const router = require('./Router/routes')
const mongoose = require('mongoose');
const cors=  require('cors')
const agenda = require('agenda');
const port = 4000;

app.use(cors());

app.use(express.json());

// Attach the router to the root path
app.use(router);

app.listen(port, async() => {
  await mongoose.connect('mongodb://0.0.0.0:27017/STUDENTINFO');
  console.log(`Example app listening on port ${port}`);
});
