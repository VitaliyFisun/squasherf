var path = require('path');
 var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

 module.exports = {
     entry: './src/main.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'main.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }

                    }
                ]
             }
         ]
     },
     plugins: [
        new webpack.IgnorePlugin(/jsdom/),
        new UglifyJsPlugin({
            uglifyOptions: {
                mangle: true
            }
        }),
    ],
     stats: {
         colors: true
     },
    devtool: 'source-map',
    watch: true,
    cache: true
 };