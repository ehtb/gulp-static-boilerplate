let configFile = 'dev.js';

if (process.env.NODE_ENV === 'production') {
  configFile = 'build.js';
} else if (process.env.NODE_ENV === 'test') {
  configFile = 'test.js';
}

const config = require(`./config/${configFile}`);

export default config;
