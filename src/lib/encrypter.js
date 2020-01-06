const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Env = require('./env');

const env = new Env();

class Encrypt {
  // eslint-disable-next-line class-methods-use-this
  async generateHash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
  }

  // eslint-disable-next-line class-methods-use-this
  async verifyHash(password, hash) {
    const verify = await bcrypt.compare(password, hash);

    return verify;
  }

  // eslint-disable-next-line class-methods-use-this
  async generateAuthenticateToken(data) {
    // eslint-disable-next-line no-underscore-dangle
    const token = jwt.sign({ id: data._id }, env.getEnv().secret, {
      expiresIn: 86400,
    });

    return token;
  }

  // eslint-disable-next-line class-methods-use-this
  async verifyAuthenticateToken(token) {
    return jwt.verify(token, env.getEnv().secret, (err, decoded) => {
      if (err) return false;
      return { ...decoded };
    });
  }
}

module.exports = Encrypt;
