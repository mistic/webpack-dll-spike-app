const runWebpack = require('../run-webpack');
const config = require('./config');

module.exports = (mode) => {
  runWebpack([
    config(mode, {})
  ]);
};
