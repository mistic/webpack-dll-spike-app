const compiler = require('./compiler');
const loader = require('./loader');
const configurator = require('./configurator');
const optionsValidator = require('./options-validator');
const BUNDLER_TYPES = require('./types');

module.exports = (options = {}) => {
  const { mode, type, exportConfig} = optionsValidator(options);

  if (exportConfig) {
    return configurator({mode, type})
  }

  console.log(`Starting bundler as ${ type } in a ${ mode } environment.`);

  if (type === BUNDLER_TYPES.COMPILER) {
    return compiler(mode);
  }

  return loader(mode);
};
