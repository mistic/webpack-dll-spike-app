const runWebpack = require('../run-webpack');
const path = require('path');
const config = require('./config');
const BUNDLER_MODES = require('../modes');
const { PATHS } = require('../constants');
const PKG_FILE = require(PATHS.pkg);

module.exports = (mode) => {
  const compilationResultCache = {};

  const vendorsDll = config(mode, {
    dllEntries: [
      {
        name: 'vendor',
        include: Object.keys(PKG_FILE.dependencies),
        exclude: []
      },
    ],
    dllDependencies: [],
    compilationResultCache
  });

  const appDll = config(mode, {
    dllEntries: [
      {
        name: 'app',
        include: [
          path.join(PATHS.code, 'core'),
          path.join(PATHS.code, 'sdk')
        ],
        exclude: []
      },
    ],
    dllDependencies: ['vendor'],
    compilationResultCache
  });

  const dllBundles = [];

  if (mode === BUNDLER_MODES.PRODUCTION) {
    dllBundles.push(...[
      vendorsDll,
      appDll
    ]);
  } else {
    dllBundles.push(...[
      vendorsDll
    ]);
  }

  runWebpack(dllBundles);
};
