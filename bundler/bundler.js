const paramsValidator = require('./params-validator');
const BUNDLER_TYPES = require('./types');

module.exports = (params = {}) => {
  const { mode, type, exportConfig} = paramsValidator(params);

  console.log(`${exportConfig ? 'Exporting configuration' : 'Starting bundler'} as ${ type } in a ${ mode } environment.`);

  if (exportConfig && type === BUNDLER_TYPES.COMPILER) {
    const compilerConfig = require('./compiler/config');
    return compilerConfig(mode);
  }

  if (exportConfig) {
    const loaderConfig = require('./loader/config');
    return loaderConfig(mode);
  }

  if (type === BUNDLER_TYPES.COMPILER) {
    const compiler = require('./compiler');
    return compiler(mode);
  }

  const loader = require('./loader');
  return loader(mode);
};
