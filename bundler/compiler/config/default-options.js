const { PATHS } = require('../../constants');
const PKG_FILE = require(PATHS.pkg);

module.exports = {
  dllEntries: [
    {
      name: 'vendor',
      include: Object.keys(PKG_FILE.dependencies),
      exclude: []
    },
  ],
  dllDependencies: [],
  compilationResultCache: {}
};
