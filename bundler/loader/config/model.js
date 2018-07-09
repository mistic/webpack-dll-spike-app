const path = require('path');
const merge = require('webpack-merge');
const parts = require('../../parts');
const BUNDLER_MODES = require('../../modes');
const { PATHS } = require('../../constants');

/*function prodLoaderCompleteConfig(options) {
  return merge(
    {
      entry: {
        main: PATHS.codeEntry
      },
      mode: 'production',
      devtool: 'source-map',
      output: {
        publicPath: '/',
        path: PATHS.build,
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[chunkhash:8].js'
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
    parts.loadDLLS(PATHS.baseDir, PATHS.build, options.dlls),
    parts.indexTemplate({
      template: PATHS.htmlTemplate,
      title: 'Webpack DLL Spike - App',
      filename: 'index.html',
      inject: 'body'
    }),
    parts.addMissingAssetsFromCompilationResultFile(options.compilationResultFile)
  );
}*/

function common(options) {
  return merge(
    {
      entry: {
        main: PATHS.codeEntry
      },
      output: {
        publicPath: '/',
        path: PATHS.build,
        filename: '[name].js'
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
    parts.loadDLLS(PATHS.baseDir, PATHS.build, options.dlls),
    parts.indexTemplate({
      template: PATHS.htmlTemplate,
      title: 'Webpack DLL Spike - App',
      filename: 'index.html',
      inject: 'body'
    }),
    parts.addMissingAssetsFromCompilationResultFile(options.compilationResultFile)
  );
}

function unoptimized(options) {
  return merge(
    {
      entry: {
         main: ['react-hot-loader/patch', PATHS.codeEntry]
      },
      mode: 'development',
      devtool: 'eval-source-map',
      output: {
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
      }
    },
    parts.lintTSX(PATHS.code),
    parts.lintCSS(),
    parts.loadCSS({
      path: [PATHS.src]
    }),
    parts.loadImages({
      include: PATHS.assets,
      options: {
        name: 'assets/images/[name].[ext]'
      }
    }),
    parts.loadTSX(PATHS.code),
  );
}

function optimized(options) {
  return merge(
    {
      mode: 'production',
      devtool: 'source-map',
      output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[chunkhash:8].js'
      }
    },
    parts.loadTSX(PATHS.codeEntry),
  );
}

module.exports = (mode, options) => {
  if (mode === BUNDLER_MODES.PRODUCTION) {
    return merge(common(options), optimized(options));
  }

  return merge(common(options), unoptimized(options));
};
