let configFile = 'dev.js';

if (process.env.NODE_ENV === 'production') {
  configFile = 'build.js';
}

const config = require(`./config/${configFile}`);

export default config;
