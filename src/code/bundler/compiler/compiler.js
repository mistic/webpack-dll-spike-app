const path = require('path');
const merge = require('webpack-merge');
const parts = require('../parts');
const BUNDLER_MODES = require('../modes');

const BASE_DIR = path.join(__dirname, '../../../../');
const PATHS = {
  src: path.join(BASE_DIR, 'src'),
  code: path.join(BASE_DIR, 'src/code'),
  build: path.join(BASE_DIR, 'build'),
  dlls: path.join(BASE_DIR, 'build/dlls'),
  assets: path.join(BASE_DIR, 'src/assets'),
  styles: path.join(BASE_DIR, 'src/styles'),
  codeEntry: path.join(BASE_DIR, 'src/code/index.tsx'),
  stylesEntry: path.join(BASE_DIR, 'src/styles/app.scss'),
  pkg: path.join(BASE_DIR, 'package.json')
};
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

function unoptimized() {
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
        dllName: '[name]_[hash:8]',
        path: PATHS.build,
        publicPath: '/'
      }
    })
  );
}

function optimized() {
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
      context: BASE_DIR,
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
        dllName: '[name]_[hash:8]',
        path: PATHS.build,
        publicPath: '/'
      }
    })
  );
}

module.exports = (mode) => {
  if (mode === BUNDLER_MODES.PRODUCTION) {
    return merge(common(), optimized())
  }

  return merge(common(), unoptimized());
};
