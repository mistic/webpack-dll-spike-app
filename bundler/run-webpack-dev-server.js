module.exports = (mode) => {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('./loader/config')(mode);
  const compiler = webpack(webpackConfig);
  const webpackDevServerConfig = webpackConfig.devServer;
  const server = new WebpackDevServer(compiler, webpackDevServerConfig);

  server.listen(webpackConfig.devServer.port);

  console.log('Serving on http://localhost:' + webpackConfig.devServer.port);
};
