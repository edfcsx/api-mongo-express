const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');

const info = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), { encoding: 'utf8' }));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.get('/ping', (req, res) => res.status(200).json({
  application: info.name,
  version: info.version,
}));

require('./app/controllers/')(app);

module.exports = app;
