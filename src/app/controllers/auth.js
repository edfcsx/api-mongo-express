/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */

const express = require('express');
const crypto = require('crypto');

const mailer = require('../../modules/mailer');
const User = require('../models/user');
const Encrypt = require('../../lib/encrypter');

const router = express.Router();
const encrypter = new Encrypt();

router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'User already exists' });
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: await encrypter.generateAuthenticateToken(user),
    });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  if (!await encrypter.verifyHash(password, user.password)) {
    return res.status(404).send({ error: 'Password incorrect' });
  }

  return res.status(200).send({
    user,
    token: await encrypter.generateAuthenticateToken(user),
  });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.updateOne({ _id: user.id }, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    await mailer.sendMail({
      to: email,
      from: 'edfcsx@gmail.com',
      template: 'auth/forgot_password',
      context: { token },
    // eslint-disable-next-line consistent-return
    }, (err) => {
      if (err) {
        return res.status(400).send({ error: 'Cannot send forgot password email' });
      }
    });

    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: 'Erro on forgot password, try again' });
  }
});

router.post('/reset_password', async (req, res) => {
  const { token, email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

    if (!user)
      return res.status(400).send({ error: 'user not found' });

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'token invalid' });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expired, generate a new token!' });

    user.password = password;

    await user.save();

    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: 'Cannot reset password, try again!' });
  }
});

module.exports = (app) => app.use('/auth', router);
