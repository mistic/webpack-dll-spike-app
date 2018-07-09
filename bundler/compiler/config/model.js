const path = require('path');
const merge = require('webpack-merge');
const parts = require('../../parts');
const BUNDLER_MODES = require('../../modes');
const { PATHS } = require('../../constants');

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

function unoptimized(options) {
  return merge(
    {
      mode: 'development',
      devtool: 'eval-source-map'
    },
    parts.generateDLLS({
      entries: options.dllEntries,
      output: {
        manifestName: '[name]',
        dllName: '[name]_[chunkhash:8]',
        path: PATHS.build,
        publicPath: '/'
      }
    })
  );
}

function optimized(options) {
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
        name: 'assets/[folder]/[name].[hash:8].[ext]'
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
      entries: options.dllEntries,
      output: {
        manifestName: '[name]',
        dllName: '[name]_[chunkhash:8]',
        path: PATHS.build,
        publicPath: '/'
      }
    }),
    parts.loadDLLS(PATHS.baseDir, PATHS.build, options.dllDependencies),
    parts.generateCompilationResultFile({
      fileName: 'compilation-result.json',
      seed: options.compilationResultCache,
      filter: (manifestItem) => {
        const { path } = manifestItem;

        return (/\.dll\.js$/.test(path) || /\.css$/.test(path));
      },
      map: (manifestItem) => {
        return {
          ...manifestItem,
          name: /\.js$/.test(manifestItem.name)
            ? manifestItem.name.replace('.js', '.dll.js')
            : manifestItem.name
        }
      }
    })
  );
}

module.exports = (mode, options) => {
  if (mode === BUNDLER_MODES.PRODUCTION) {
    return merge(common(options), optimized(options))
  }

  return merge(common(options), unoptimized(options));
};
