const path = require("path");
const WebExtWebpackPlugin = require("web-ext-plugin");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const manifest = require("./src/manifest.json");
const version = require("./package.json").version;

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    prisPerKvm: "./prisPerKvm.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new WebExtWebpackPlugin({
      sourceDir: path.resolve(__dirname, "dist"),
      startUrl: "https://www.finn.no/realestate/homes/search.html",
    }),
    new WebpackExtensionManifestPlugin({
      config: {
        base: manifest,
        extend: { version },
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: "icons", to: "icons" },
        {
          from: "../node_modules/webextension-polyfill/dist/browser-polyfill.js",
        },
      ],
    }),
  ],
  optimization: {
    // Forked from: https://github.com/sindresorhus/refined-github/blob/master/webpack.config.ts
    // Without this, function names will be garbled and enableFeature won't work
    concatenateModules: true,

    // Automatically enabled on production; keeps it somewhat readable for AMO reviewers
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: false,
          compress: {
            defaults: false,
            dead_code: true,
            unused: true,
            arguments: true,
            join_vars: false,
            booleans: false,
            expression: false,
            sequences: false,
          },
          output: {
            beautify: true,
            indent_level: 2,
          },
        },
      }),
    ],
  },
};
