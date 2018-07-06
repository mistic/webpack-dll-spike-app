const BUNDLER_TYPES = require('./types');
const BUNDLER_MODES = require('./modes');

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

  const exportConfig = (
    typeof options.exportConfig === "boolean"
  )
    ? options.exportConfig
    : false;

  return { mode, type, exportConfig };
};
