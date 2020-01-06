const moongose = require('mongoose');

moongose.connect('mongodb://localhost/noderest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

moongose.Promise = global.Promise;

module.exports = moongose;
