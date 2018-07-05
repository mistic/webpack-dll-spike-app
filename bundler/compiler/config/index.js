const defaultConfig = require('defaults');
const model = require('./model');

module.exports = (mode, config) => {
  if (config) {
    return model(mode, config);
  }

  return model(mode, defaultConfig);
};
