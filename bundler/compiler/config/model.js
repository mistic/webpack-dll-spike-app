const path = require('path');
const merge = require('webpack-merge');
const parts = require('../parts');
const BUNDLER_MODES = require('../modes');
const { PATHS } = require('../constants');
const PKG_FILE = require(PATHS.pkg);

function common() {
  return merge(
    {
      output: {
        publicPath: '/',
        path: PATHS.build
      }
    },
    parts.clean(PATHS.build)
  );
}

function unoptimized(config) {
  return merge(
    {
      mode: 'development',
      devtool: 'eval-source-map'
    },
    parts.generateDLLS({
      entries: [
        {
          name: 'vendor',
          dependencies: Object.keys(PKG_FILE.dependencies),
          excludes: []
        }
      ],
      output: {
        manifestName: '[name]',
        dllName: '[name]_[chunkhash:8]',
        path: PATHS.build,
        publicPath: '/'
      }
    })
  );
}

function optimized(config) {
  return merge(
    {
      mode: 'production',
      devtool: 'source-map',
    },
    parts.ignoreFiles([
      /scss\.d\.ts$/
    ]),
    parts.lintTSX(PATHS.code),
    parts.lintCSS(),
    parts.setAlias({
      code: path.resolve(PATHS.code),
      styles: path.resolve(PATHS.styles),
      assets: path.resolve(PATHS.assets)
    }),
    parts.loadTSX(PATHS.code),
    parts.loadImages({
      include: PATHS.assets,
      options: {
        name: `assets/[folder]/[name].[hash:8].[ext]`
      }
    }),
    parts.minifyCSS({
      options: {
        discardComments: {
          removeAll: true,
          safe: true
        }
      }
    }),
    parts.extractCSS(PATHS.src),
    parts.generateDLLS({
      context: PATHS.baseDir,
      entries: [
        {
          name: 'vendor',
          dependencies: Object.keys(PKG_FILE.dependencies),
          excludes: []
        },
        {
          name: 'app',
          dependencies: [
            path.join(PATHS.code, 'core'),
            path.join(PATHS.code, 'sdk')
          ],
          excludes: []
        }
      ],
      output: {
        manifestName: '[name]',
        dllName: '[name]_[chunkhash:8]',
        path: PATHS.build,
        publicPath: '/'
      }
    })
  );
}

module.exports = (mode, options) => {
  if (mode === BUNDLER_MODES.PRODUCTION) {
    return merge(common(config), optimized(options))
  }

  return merge(common(options), unoptimized(options));
};
