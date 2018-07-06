const path = require('path');
const merge = require('webpack-merge');
const parts = require('../parts');
const BUNDLER_MODES = require('../modes');
const { PATHS } = require('../constants');

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
  );
}

function unoptimizedBuild() {
  return merge(
    {
      entry: {
        app: ['react-hot-loader/patch', PATHS.code]
      },
      output: {
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
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
      port: process.env.PORT
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
      template: PATHS.htmlTemplate,
      title: 'Webpack DLL Spike - App',
      filename: 'index.html',
      inject: 'body'
    })
  );
}

function testLoaderProd() {
  return merge(
    {
      entry: {
        app: PATHS.codeEntry
      },
      mode: 'production',
      devtool: 'source-map',
      output: {
        publicPath: '/',
        path: PATHS.build,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
      }
    },
    parts.ignoreFiles([
      /scss\.d\.ts$/
    ]),
    parts.setAlias({
      code: path.resolve(PATHS.code),
      styles: path.resolve(PATHS.styles),
      assets: path.resolve(PATHS.assets)
    }),
    parts.loadTSX(PATHS.codeEntry),
    parts.loadDLLS(PATHS.baseDir, PATHS.build),
    parts.indexTemplate({
      template: PATHS.htmlTemplate,
      title: 'Webpack DLL Spike - App',
      filename: 'index.html',
      inject: 'body'
    })
  );
}

module.exports = (mode, options) => {
  /*if (mode === BUNDLER_MODES.PRODUCTION) {
    return merge(preBuildCommon(options), optimizedBuild(options), postBuildCommon(options));
  }

  return merge(preBuildCommon(options), unoptimizedBuild(options), postBuildCommon(options));*/

  return merge(testLoaderProd(options));
};
