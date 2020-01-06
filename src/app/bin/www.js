const http = require('http');
const debug = require('debug')('api-rest-express-mongodb:server');

const app = require('../../index');

const port = 3000;

const server = http.createServer(app);

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`server listener on port ${port}`));

// eslint-disable-next-line no-use-before-define
server.on('error', onError);

// eslint-disable-next-line no-use-before-define
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line prefer-template
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line prefer-template
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `Pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on  ${bind}`);
}
