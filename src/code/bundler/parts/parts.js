const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const cssnano = require('cssnano');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

exports.loadImages = ({ include, exclude, options } = {}) => ({
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
              name: options.name || '[hash].[ext]'
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

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.extractCSS = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
      })
    ]
  };
};

exports.lintCSS = () => ({
  plugins: [
    new StyleLintPlugin()
  ],
});

exports.loadCSS = ({ include, exclude, path } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        include,
        exclude,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
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

exports.devServer = function (options) {
  const ret = {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
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

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  };
};

exports.applyOptimization = function (options) {
  options = options || {};

  return {
    optimization: {
      minimize: options.minimize || false,
      namedModules: options.namedModules || true,
      splitChunks: options.splitChunks || false,
      noEmitOnErrors: options.noEmitOnErrors || false,
      concatenateModules: options.concatenateModules || false
    }
  }
};
