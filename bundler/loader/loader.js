const runWebpack = require('../run-webpack');
const config = require('./config');
const { PATHS } = require('../constants');

module.exports = (mode) => {
  const COMPILATION_RESULT_FILE = require(PATHS.compilationResult);

  runWebpack(config(mode, {
    dlls: Object.keys(COMPILATION_RESULT_FILE).filter((dll) => /\.dll\.js$/.test(dll)).map((dll) => dll.replace('.dll.js', '')),
    compilationResultFile: COMPILATION_RESULT_FILE
  }));
};
