var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var pixrem = require('pixrem');
var postcssCalc = require('postcss-calc');
var postcssCustomProperties = require('postcss-custom-properties');
var postcssCustomMedia = require('postcss-custom-media');
var postcssImport = require('postcss-import');
var postcssMixins = require('postcss-mixins');
var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: './dist',
        publicPath: '/',
        filename: 'scripts.js'
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            './src/'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },
    postcss: () => {
        return [
            postcssImport,
            postcssCustomProperties,
            postcssCalc,
            postcssCustomMedia,
            postcssMixins,
            autoprefixer,
            pixrem,
        ];
    },
    plugins: [
        new ExtractTextPlugin('styles.css')
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]);
} else {
    module.exports.devtool = '#source-map';
}