const { join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* Setup */
const IS_PRODUCTION = process.argv.indexOf('-p') > -1;
const NAME_SUFFIX = new Date().getTime() + (IS_PRODUCTION ? '.min' : '');
const PORT = 9000;
const PATH_PROJECT = join(__dirname, '..');
const PATH_SOURCE = join(PATH_PROJECT, 'src');
const PATH_BUILD = join(PATH_PROJECT, 'docs');
const PATH_DATA = 'data';
const PATH_ASSETS = 'assets';

const config = {
  entry: {
    main: join(PATH_SOURCE, 'index.js')
  },
  output: {
    path: PATH_BUILD,
    filename: join(PATH_ASSETS, `index${NAME_SUFFIX}.js`)
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [PATH_SOURCE],
      options: {
        presets: ['env', 'stage-1', 'react'],
        plugins: [require('babel-plugin-transform-object-rest-spread')]
      }
    }, {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /\.(png|jpg|gif|svg|ico)$/,
      loader: 'file-loader',
      options: {
        name: join(PATH_DATA, '[name].[ext]')
      }
    }, {
      test: /\.ne$/,
      use: ['raw-loader']
    }]
  },
  plugins: [
    new ExtractTextPlugin(join(PATH_ASSETS, `main${NAME_SUFFIX}.css`)),
    new HtmlWebpackPlugin({
      template: join(PATH_SOURCE, 'index.html'),
      filename: 'index.html',
      allChunks: true
    }),
    new CleanWebpackPlugin([PATH_BUILD], {
      root: PATH_PROJECT,
      verbose: false,
      dry: false,
      exclude: ['data']
    })
  ],
  performance: {
    hints: false
  },
  stats: {
    children: false,
    hash: false,
    version: false,
    colors: true
  },
  node: {
    fs: 'empty'
  }
};

if (IS_PRODUCTION) {
  config.output.publicPath = '/nearley-editor';
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  );
} else {
  const LiveReloadPlugin = require('webpack-livereload-plugin');

  require('serve-local')(PATH_BUILD, PORT);
  config.devtool = '#eval-source-map';

  config.plugins.push(new LiveReloadPlugin({
    appendScriptTag: true,
    ignore: /.(js|config|json|ico|woff|html)$/
  }));
}

module.exports = config;
