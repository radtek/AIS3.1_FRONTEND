const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const extractTextPlugin = require('extract-text-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const generateAssetPlugin = require('generate-asset-webpack-plugin');

const createServerConfig = function(compilation) {
    let cfgJson = {
        ipPort: 'localhost:8080/ais3.1/',
        screenPort: 'localhost:8080/ais3.1/'
    };
    return JSON.stringify(cfgJson);
}

module.exports = {
    devtool: '#source-map',
    context: path.resolve('./app'),
    entry: {
        index: './index.entry.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/app/',
        filename: 'js/[name].[hash:8].js',
        chunkFilename: "js/[name].chunk.[chunkhash].js",
        sourceMapFilename: 'js/[name].map'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json', '.html', '.less', '.css'],
        modules: [path.join(__dirname, "app"), "node_modules"],
        alias: {
            jquery: "jquery/dist/jquery.min"
        }
    },
    module: {
        rules: [{
            test: /\.html$/,
            use: ['raw-loader'],
            exclude: /node_modules/
        }, {
            test: /\.js(x)*$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader', 'postcss-loader'],
                publicPath: '../'
            }),
            include: path.join(__dirname, 'app')
        }, {
            test: /\.css$/,
            use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader'],
                publicPath: '../'
            })
        }, {
            test: /\.(jpg|png|gif|ico)$/,
            use: ['url-loader?limit=10240&name=img/[name].[hash:8].[ext]']
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            use: ['url-loader?limit=10240&name=fonts/[name].[hash:8].[ext]']
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                postcss: [autoprefixer]
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['manifest'],
            minChunks: function(module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, 'app/index.html'),
            favicon: path.resolve(__dirname, 'app/img/favicon.ico'),
            chunks: ['manifest', 'index']
        }),
        // new htmlWebpackPlugin({
        //     filename: 'oprm.html',
        //     template: path.resolve(__dirname, 'app/index.html'),
        //     favicon: path.resolve(__dirname, 'app/img/favicon.ico'),
        //     chunks: ['manifest', 'oprm']
        // }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new extractTextPlugin({
            filename: 'css/[name].[hash:8].css',
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            beautify: false, // 最紧凑的输出
            comments: false, // 删除所有的注释
            compress: {
                warnings: false, // UglifyJs删除没有用到的代码时，不输出警告
                drop_console: true, // 删除所有的'console'语句。可以兼容ie浏览器
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true, // 提取出现多次但是没有定义成变量去引用的静态值
                screw_ie8: true
            },
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            }
        }),
        new ngAnnotatePlugin({ add: true }),
        new generateAssetPlugin({
            filename: 'ipConfig.json',
            fn: (compilation, cb) => {
                cb(null, createServerConfig(compilation));
            },
            extraFiles: []
        })
    ]
};