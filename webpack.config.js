const path = require('path');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  // mode: 'development',

  // add fetch-json.js entry point
  entry: {
    ...defaultConfig.entry.call(),
    'fetch-jsonp': path.resolve(process.cwd(), 'src', 'fetch-jsonp.js')
  },

  // get `fetch-jsonp` to show up in index.asset.php
  plugins: [
    ...defaultConfig.plugins.filter((plugin) =>
        plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
    ),
    new DependencyExtractionWebpackPlugin({
      injectPolyfill: true,
      requestToExternal(request) {
        if (request === 'fetch-jsonp') {
          // Expect to find `fetch-jsonp` as fetchJSONP in the global scope:
          return 'fetchJSONP';
        }
      },
    }),
  ]
};
