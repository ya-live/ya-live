/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-param-reassign */
const withCSS = require('@zeit/next-css');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = withCSS({
  webpack: (config) => {
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
