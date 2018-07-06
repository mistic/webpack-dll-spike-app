const options = require('options');
const model = require('./model');

module.exports = (mode) => {
  if (config) {
    return model(mode, options);
  }
};
