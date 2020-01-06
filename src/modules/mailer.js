const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const Env = require('../lib/env');

const env = new Env();

const {
  host,
  port,
  user,
  pass,
} = env.getEnv().mailer;

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
});

const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    defaultLayout: null,
    partialsDir: path.resolve('./src/resources/mail'),
    layoutsDir: path.resolve('./src/resources/mail'),
  },
  viewPath: path.resolve('./src/resources/mail'),
  extName: '.html',
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;
