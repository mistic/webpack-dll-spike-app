const BUNDLER_TYPES = require('./types');
const BUNDLER_MODES = require('./modes');
const BUNDLER_TARGETS = require('./targets');

module.exports = (options = {}) => {
  const mode = (
    options.mode === BUNDLER_MODES.PRODUCTION
    || options.mode === BUNDLER_MODES.DEVELOPMENT
  )
    ? options.mode
    : BUNDLER_MODES.PRODUCTION;

  const type = (
    options.type === BUNDLER_TYPES.COMPILER
    || options.type === BUNDLER_TYPES.LOADER
  )
    ? options.type
    : BUNDLER_TYPES.LOADER;

  const target = (
    options.target === BUNDLER_TARGETS.INTERNAL
    || options.target === BUNDLER_TARGETS.EXTERNAL
    || options.target === BUNDLER_TARGETS.WEBPACK_DEV_SERVER
  )
    ? options.target
    : BUNDLER_TARGETS.INTERNAL;

  return { mode, type, target };
};
