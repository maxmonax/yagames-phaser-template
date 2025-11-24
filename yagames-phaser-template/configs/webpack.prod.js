const path = require('path/posix');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// paths
const __base = path.resolve(__dirname, '..');
const __src = path.resolve(__base, 'src');

module.exports = merge(common, {
    // prod mode
    mode: 'production',
    devtool: false,

    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                baseUrl: __base,
                configFile: path.join(__base, 'tsconfig.prod.json')
            })
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        })
    ],
    module: {
        rules: [
            // css|sass files
            {
                test: /\.(css|scss|sass)$/i,
                use: [
                    // minificator
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin()
        ]
    }
});
