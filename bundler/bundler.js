const paramsValidator = require('./params-validator');
const BUNDLER_TYPES = require('./types');
const BUNDLER_TARGETS = require('./targets');
const runWebpackDevServer = require('./run-webpack-dev-server');

module.exports = (params = {}) => {
  const { mode, type, target} = paramsValidator(params);

  console.log(`Starting bundler as ${ type } in a ${ mode } environment for ${ target } target.`);

  if (target === BUNDLER_TARGETS.WEBPACK_DEV_SERVER) {
    return runWebpackDevServer(mode);
  }

  if (target === BUNDLER_TARGETS.EXTERNAL && type === BUNDLER_TYPES.COMPILER) {
    const compilerConfig = require('./compiler/config');
    return compilerConfig(mode);
  }

  if (target === BUNDLER_TARGETS.EXTERNAL) {
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
