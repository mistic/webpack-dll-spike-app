module.exports = (mode) => {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('./loader/config')(mode);
  const webpackDevServerConfig = webpackConfig.devServer || {};
  const host = webpackDevServerConfig.host || 'localhost';
  const port = webpackDevServerConfig.port || '8080';

  // Inject WDS Entry Points Manually as we are using WDS Node API.
  const wdsEntryPoints = [`webpack-dev-server/client?http://${ host }:${ port }`];

  if (webpackDevServerConfig.hotOnly) {
    wdsEntryPoints.push('webpack/hot/only-dev-server');
  } else if (webpackDevServerConfig.hot) {
    wdsEntryPoints.push('webpack/hot/dev-server');
  }

  const prependDevClient = (entry) => {
    if (typeof entry === 'function') {
      return () => Promise.resolve(entry()).then(prependDevClient);
    }
    if (typeof entry === 'object' && !Array.isArray(entry)) {
      const entryClone = {};
      Object.keys(entry).forEach((key) => {
        entryClone[key] = wdsEntryPoints.concat(entry[key]);
      });
      return entryClone;
    }
    return wdsEntryPoints.concat(entry);
  };

  [].concat(webpackConfig).forEach((wpOpt) => {
    wpOpt.entry = prependDevClient(wpOpt.entry || './src');
  });


  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, webpackDevServerConfig);
  server.listen(port);

  console.log(`Serving on http://${ host }:${ port }`);
};
