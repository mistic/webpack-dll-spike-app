const webpack = require("webpack");
const supportsColor = require('supports-color');

module.exports = async function (config) {
  return new Promise((resolve) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const statsColors = process.stdout.isTTY === true ? supportsColor.stdout : false;
      const statsString = stats.toString({
        colors: statsColors
      });

      process.stdout.write(`${statsString}\n`);
      resolve();
    });
  });
};
