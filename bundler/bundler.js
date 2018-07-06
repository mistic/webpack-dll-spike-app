const compiler = require('./compiler');
const loader = require('./loader');
const compilerConfig = require('./compiler/config');
const loaderConfig = require('./loader/config');
const optionsValidator = require('./options-validator');
const BUNDLER_TYPES = require('./types');

module.exports = (options = {}) => {
  const { mode, type, exportConfig} = optionsValidator(options);

  console.log(`${exportConfig ? 'Exporting configuration' : 'Starting bundler'} as ${ type } in a ${ mode } environment.`);

  if (exportConfig && type === BUNDLER_TYPES.COMPILER) {
    return compilerConfig(mode);
  }

  if (exportConfig) {
    return loaderConfig(mode);
  }

  if (type === BUNDLER_TYPES.COMPILER) {
    return compiler(mode);
  }

  return loader(mode);
};
