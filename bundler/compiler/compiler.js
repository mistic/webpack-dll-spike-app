const runWebpack = require('../run-webpack');
const path = require('path');
const config = require('./config');
const BUNDLER_MODES = require('../modes');
const { PATHS } = require('../constants');
const PKG_FILE = require(PATHS.pkg);

function dllConfigGenerator(mode, dllConfig) {
  return config.bind(this, mode, dllConfig);
}

module.exports = async (mode) => {
  const compilationResultCache = {};

  const vendorsDll = dllConfigGenerator(mode, {
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

  const appDll = dllConfigGenerator(mode, {
    clean: false,
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

  for (const dllBundle of dllBundles) {
    await runWebpack(dllBundle())
  }
};
