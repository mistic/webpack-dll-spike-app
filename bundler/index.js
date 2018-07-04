const bundler = require('./bundler');
const { set } = require('lodash');

const options = process.argv
  .slice(2)
  .reduce((acc, arg) => {
    const [k, v] = arg.split('=');
    const parsedK = k.replace('--','');
    const parsedV = typeof v === "undefined" && k ? true : v;
    const camelCasedK = parsedK.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

    set(acc, camelCasedK, parsedV);

    return acc;
  }, {});

// Determine if run through npm webpack or by our own
const runFromWebpack = options && options.config && options.env;

if (runFromWebpack) {
  return bundler(options.env)
}

return bundler(options);
