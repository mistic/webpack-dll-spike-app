const runWebpack = require('../run-webpack');
const config = require('./config');
const { PATHS } = require('../constants');

module.exports = async (mode) => {
  const COMPILATION_RESULT_FILE = require(PATHS.compilationResult);
  const filteredDllNames = Object.keys(COMPILATION_RESULT_FILE)
    .filter((dll) => /\.dll\.js$/.test(dll))
    .map((dll) => dll.replace('.dll.js', ''));

  await runWebpack(config(mode, {
    dlls: filteredDllNames,
    compilationResultFile: COMPILATION_RESULT_FILE
  }));
};
