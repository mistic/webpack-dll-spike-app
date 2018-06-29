const path = require('path');
const merge = require('webpack-merge');
const parts = require('../parts');
const BUNDLER_MODES = require('../modes');

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

function preBuildCommon() {
  return merge(
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
      assets: path.resolve(PATHS.assets)
    }),
    parts.loadTSX(PATHS.code),
  );
}

function unoptimizedBuild() {
  return merge(
    {
      entry: {
        app: ['react-hot-loader/patch', PATHS.code]
      },
      mode: 'development',
      devtool: 'eval-source-map'
    },
    parts.loadImages({
      include: PATHS.assets,
      options: {
        name: `assets/[folder]/[name].[ext]`
      }
    }),
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

function optimizedBuild() {
  return merge(
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
    parts.clean(PATHS.build),
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
    parts.extractCSS(PATHS.src)
  );
}

function postBuildCommon() {
  return merge(
    parts.indexTemplate({
      template: HTML_TEMPLATE,
      title: 'Webpack DLL Spike - App',
      filename: 'index.html',
      inject: 'body'
    })
  );
}

module.exports = (mode) => {
  if (mode === BUNDLER_MODES.PRODUCTION) {
    return merge(preBuildCommon(), optimizedBuild(), postBuildCommon());
  }

  return merge(preBuildCommon(), unoptimizedBuild(), postBuildCommon());
};
