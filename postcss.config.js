/* eslint-disable global-require */
module.exports = ({ env }) => ({
  plugins: [
    require('autoprefixer')({
      remove: false,
    }),
    env !== 'development' &&
      require('cssnano')({
        preset: 'default',
      }),
  ],
});
