const path = require('path');
const merge = require('webpack-merge');

const parts = require('../parts');

const TARGET = process.env.npm_lifecycle_event;
const ENABLE_POLLING = process.env.ENABLE_POLLING;
const BASE_DIR = path.join(__dirname, '../../../../');
const PATHS = {
  src: path.join(BASE_DIR, 'src'),
  code: path.join(BASE_DIR, 'src/code'),
  build: path.join(BASE_DIR, 'build'),
  assets: path.join(BASE_DIR, 'src/assets'),
  styles: path.join(BASE_DIR, 'src/styles'),
  codeEntry: path.join(BASE_DIR, 'src/code/index.tsx'),
  stylesEntry: path.join(BASE_DIR, 'src/styles/app.scss'),
  records: path.join(BASE_DIR, 'records.json')
};
const HTML_TEMPLATE = path.join(PATHS.src, '/index.ejs');

process.env.BABEL_ENV = TARGET;

const common = merge(
  {
    entry: {
      app: PATHS.code
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    }
  },
  parts.lintTSX(PATHS.code),
  parts.lintCSS(),
  parts.setAlias({
    code: path.resolve(PATHS.code),
    styles: path.resolve(PATHS.styles),
    assets: path.resolve(PATHS.assets),
  }),
  parts.loadTSX(PATHS.code),
  parts.loadImages({
    include: PATHS.assets,
    options: {
      name: 'assets/[folder]/[name].[hash:8].[ext]',
    },
  }),

  parts.indexTemplate({
    template: HTML_TEMPLATE,
    title: 'Webpack DLL Spike - App',
    appMountId: 'app'
  }),
);

let config;

// Branch based on NPM Lifecycle Event
switch (TARGET) {
  case 'compile:build':
    config = merge(
      common,
      {
        mode: 'production',
        devtool: 'source-map',
        output: {
          publicPath: '/',
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.applyOptimization({
        minimize: true,
        namedModules: false,
        noEmitOnErrors: true,
        concatenateModules: true
      }),
      parts.clean(PATHS.build),
      parts.minifyCSS({
        options: {
          discardComments: {
            removeAll: true,
            safe: true,
          },
        },
      }),
      parts.extractCSS(PATHS.src),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      )
    );
    break;
  default:
    config = merge(
      common,
      {
        mode: 'development',
        devtool: 'eval-source-map',
      },
      parts.loadCSS({
        path: PATHS.src
      }),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
        poll: ENABLE_POLLING
      })
    );
}

module.exports = config;
