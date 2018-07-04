const optionsValidator = require('..//options-validator');
const BUNDLER_TYPES = require('../types');
const compilerConfig = require('../compiler/config');
const loaderConfig = require('../loader/config');

module.exports = (options = {}) => {
  const { mode, type} = optionsValidator(options);

  if (type === BUNDLER_TYPES.COMPILER) {
    return compilerConfig(mode);
  }

  return loaderConfig(mode);
};
