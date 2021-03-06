const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const cssnano = require('cssnano');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');


exports.clean = function (paths, exclude = []) {
  return {
    plugins: [
      new CleanWebpackPlugin(paths, {
        root: process.cwd(),
        exclude
      })
    ]
  };
};

exports.devServer = function (options) {
  const ret = {
    devServer: {
      contentBase: options.contentBase || '/',
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        // TODO: this should be activated when html-webpack-plugin fixs the bug related to it
        multiStep: false
      })
    ]
  };

  if (options.poll) {
    ret.watchOptions = {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000
    };
  }

  return ret;
};

exports.extractCSS = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                modules: true,
                namedExport: true,
                localIdentName: '[folder]__[local]___[hash:base64:5]'
              }
            },
            'sass-loader',
          ],
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css',
        chunkFilename: '[id].[chunkhash:8].css',
      })
    ]
  };
};

exports.indexTemplate = function (options) {

  return {
    plugins: [
      new HtmlWebpackPlugin({
        ...options,
        template: options.template || require('html-webpack-template')
      })
    ]
  };
};

exports.ignoreFiles = function (files) {

  return {
    plugins: [
      new webpack.WatchIgnorePlugin(files)
    ]
  };
};

exports.lintCSS = () => ({
  plugins: [
    new StyleLintPlugin()
  ],
});

exports.lintTSX = function (include) {
  return {
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include,
          enforce: 'pre',
          loader: 'tslint-loader',
        },
      ],
    },
  };
};

exports.loadCSS = ({include, exclude, path} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        include,
        exclude,
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              localIdentName: '[folder]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: [path]
            }
          },
        ],
      },
    ],
  },
});

exports.loadImages = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg)$/,
        include,
        exclude,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: options.name || '[hash:8].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            query: {
              optipng: {
                optimizationLevel: 7,
              },
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
    ],
  },
});

exports.loadTSX = function (include) {
  return {
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
            }
          ],
          include: include
        }
      ],
    },
    plugins: [
      new CheckerPlugin()
    ]
  };
};

exports.minifyCSS = ({options}) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.setAlias = function (aliasList) {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
      alias: aliasList,
      plugins: [
        new TsConfigPathsPlugin()
      ]
    }
  };
};

exports.setFreeVariables = (variables) => {
  const env = {};

  variables.forEach((variable) => {
    env[variable[0]] = JSON.stringify(variable[1]);
  });

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

exports.generateDLLS = ({ context, entries, output }) => {
  const finalEntries = {};
  const ignore = ignoreList => key => !ignoreList.includes(key);

  entries.forEach((entry) => {
    finalEntries[entry.name] = entry.include.filter(ignore(entry.exclude));
  });

  return {
    entry: finalEntries,
    context,
    output: {
      filename: `dlls/${output.dllName}.dll.js`,
      path: output.path,
      publicPath: output.publicPath,
      library: output.dllName
    },
    plugins: [
      new webpack.DllPlugin({
        context,
        name: output.dllName,
        path: `${output.path}/dlls/${output.manifestName}.json`
      })
    ]
  }
};

exports.loadDLLS = (context, path, dllReferences = []) => {
  const finalDllReferences = dllReferences.map((dllReference) => {
    return new webpack.DllReferencePlugin({
      context,
      manifest: require(`${path}/dlls/${dllReference}.json`)
    });
  });

  return {
    context,
    plugins: finalDllReferences
  }
};

exports.generateCompilationResultFile = (options) => {
  return {
    plugins: [
      new ManifestPlugin({
        ...options,
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
    ]
  }
};

exports.addMissingAssetsFromCompilationResultFile = (compilationResultFile) => {
  return {
    plugins: [
      new HtmlWebpackIncludeAssetsPlugin({ publicPath:'', assets: Object.values(compilationResultFile), append: false })
    ]
  }
};
