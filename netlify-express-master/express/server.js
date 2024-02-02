'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();


let dataPoints = [
  { id: 1, x: 10, y: 20, label: 'Point 1' },
  { id: 2, x: 30, y: 40, label: 'Point 2' },
];

router.get('/data', (req, res) => {
  res.json(dataPoints);
});

router.post('/data', (req, res) => {
  const newDataPoint = req.body;
  newDataPoint.id = dataPoints.length + 1;
  dataPoints.push(newDataPoint);
  res.json(newDataPoint);
});

router.put('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedDataPoint = req.body;
  dataPoints = dataPoints.map((point) =>
    point.id === id ? updatedDataPoint : point
  );
  res.json(updatedDataPoint);
});

router.delete('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  dataPoints = dataPoints.filter((point) => point.id !== id);
  res.json({ message: 'Data point deleted successfully.' });
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
