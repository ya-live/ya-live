/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-param-reassign */
const withCSS = require('@zeit/next-css');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: isDev ? '[path]-[local]-[hash:base64:6]' : '[hash:base64:6]',
    sourceMap: isDev,
  },
  postcssLoaderOptions: {
    sourceMap: isDev,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;

    config.plugins = config.plugins || [];
    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    return config;
  },
});
