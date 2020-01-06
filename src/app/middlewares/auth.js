const Encrypter = require('../../lib/encrypter');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  const parts = authHeader.split(' ');

  if (!parts.length === 2) return res.status(401).send({ error: 'token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformated' });

  const encrypter = new Encrypter();

  const verify = await encrypter.verifyAuthenticateToken(token);

  if (verify === false) return res.status(401).send({ error: 'Token invalid' });

  req.userId = verify.id;

  return next();
};
