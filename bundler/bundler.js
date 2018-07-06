const compiler = require('./compiler');
const loader = require('./loader');
const compilerConfig = require('./compiler/config');
const loaderConfig = require('./loader/config');
const paramsValidator = require('./params-validator');
const BUNDLER_TYPES = require('./types');

module.exports = (params = {}) => {
  const { mode, type, exportConfig} = paramsValidator(params);

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
