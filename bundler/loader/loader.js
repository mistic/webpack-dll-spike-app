const runWebpack = require('../run-webpack');
const config = require('./config');

module.exports = async (mode) => {
  await runWebpack(config(mode));
};
