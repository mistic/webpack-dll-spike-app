const { PATHS } = require('../../constants');
const COMPILATION_RESULT_FILE = require(PATHS.compilationResult);
const filteredDllNames = Object.keys(COMPILATION_RESULT_FILE)
  .filter((dll) => /\.dll\.js$/.test(dll))
  .map((dll) => dll.replace('.dll.js', ''));

module.exports = {
  dlls: filteredDllNames,
  compilationResultFile: COMPILATION_RESULT_FILE
};
