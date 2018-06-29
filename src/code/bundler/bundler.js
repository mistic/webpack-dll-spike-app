const compiler = require('./compiler');
const loader = require('./loader');
const BUNDLER_TYPES = require('./types');
const BUNDLER_MODES = require('./modes');

module.exports = (env = {}) => {
  const bundler = env.bundler || {};
  const mode = (
    bundler.mode === BUNDLER_MODES.PRODUCTION
    || bundler.mode === BUNDLER_MODES.DEVELOPMENT
  )
    ? bundler.mode
    : BUNDLER_MODES.PRODUCTION;

  const type = (
    bundler.type === BUNDLER_TYPES.COMPILER
    || bundler.type === BUNDLER_TYPES.LOADER
  )
    ? bundler.type
    : BUNDLER_TYPES.LOADER;

  console.log(`Starting bundler as ${ type } in a ${ mode } environment.`);

  if (type === BUNDLER_TYPES.COMPILER) {
    return compiler(mode);
  }

  return loader(mode);
};
