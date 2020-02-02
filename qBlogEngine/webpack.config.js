const glob = require('glob');
//var path = require('path');
//var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const PostCompile = require('post-compile-webpack-plugin');
//const fs = require('fs');
const ncp = require('ncp').ncp;

module.exports = {
    mode: "development",
    context: __dirname,
    entry:
    {
        'qBlogEngine': glob.sync('./scripts/**/*.ts*')
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    plugins: [
        new PostCompile(() =>
        {
            // The following code can copy the code to another location, eg mobile app www folder
            console.log('*********************************');
            console.log(__dirname);
            console.log(process.env.NODE_ENV);
            /*ncp(__dirname + '/dist', __dirname + "/../mobileapp/www/dist", function (err)
            {
                if (err)
                {
                    return console.error(err);
                }
                console.log('done!');
            });
            ncp(__dirname + '/images', __dirname + "/../mobileapp/www/images", function (err)
            {
                if (err)
                {
                    return console.error(err);
                }
                console.log('done!');
            });
            */
            console.log('*********************************');
        }),
        new WebpackBuildNotifierPlugin({
            title: "Webpack - qBlogEngine",
            alwaysNotify: true,
            //logo: path.resolve("./img/favicon.png"),
            suppressSuccess: false,
            sound: false,
            wait: true,
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'q Blog Engine',
            template: './scripts/index.html',
            filename: '../index.html' //relative to root of the application
        })
    ],
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.svg$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './images/[name].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    resolve: {
        extensions: [
            //'',
            '.webpack.js',
            '.web.js',
            '.ts',
            '.tsx',
            '.js']
    },
    devtool: 'source-map',
};