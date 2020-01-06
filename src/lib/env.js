const path = require('path');
const fs = require('fs');

class Env {
  // eslint-disable-next-line class-methods-use-this
  getEnv() {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../env.json'), { encoding: 'utf8' }));
    return data;
  }
}

module.exports = Env;
