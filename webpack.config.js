const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const generateAssetPlugin = require('generate-asset-webpack-plugin');

const createServerConfig = function(compilation) {
    let cfgJson = {
        ipPort: 'localhost:8080/ais3.1/',
        screenPort: 'localhost:8080/ais3.1/'
    };
    return JSON.stringify(cfgJson);
}

module.exports = {
    devtool: '#inline-source-map',
    context: path.resolve('./app'),
    entry: {
        index: './index.entry.js'
        // oprm: './oprm.entry.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
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
            use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
            include: path.join(__dirname, 'app')
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
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
                NODE_ENV: '"development"'
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.LoaderOptionsPlugin({
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
        new generateAssetPlugin({
            filename: 'ipConfig.json',
            fn: (compilation, cb) => {
                cb(null, createServerConfig(compilation));
            },
            extraFiles: []
        })
    ],
    devServer: {
        port: 8031,
        host: '0.0.0.0',
        // disableHostCheck: true,
        historyApiFallback: true,
        // 启用gzip压缩
        compress: true,
        inline: true,
        noInfo: true,
        hot: true,
        stats: { colors: true }
    }
};