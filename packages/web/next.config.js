// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const withImages = require('next-images');
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const { parsed: localEnv } = require('dotenv').config({ path: 'variables.env' });

module.exports = withPlugins([withCSS, withSass, withImages, withFonts], {
    webpack(config, options) {
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader',
        });

        // local env variables
        config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

        return config;
    },
});
