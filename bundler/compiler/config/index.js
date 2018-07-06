const defaultOptions = require('default-options');
const model = require('./model');

module.exports = (mode, options) => {
  if (options) {
    return model(mode, options);
  }

  return model(mode, defaultOptions);
};
