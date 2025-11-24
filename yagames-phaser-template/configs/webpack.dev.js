const path = require('path/posix');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// paths
const __base = path.resolve(__dirname, '..');
const __src = path.resolve(__base, 'src');

module.exports = merge(common, {

    // dev mode
    mode: 'development',
    devtool: 'inline-source-map',

    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                baseUrl: __base,
                configFile: path.join(__base, 'tsconfig.json')
            })
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    // dev server
    devServer: {
        port: 9100,
        static: './build',
        hot: true,
        client: {
            overlay: true
        }
    },
    
    // general rules
    module: {
        rules: [
            // css|sass files
            {
                test: /\.(css|scss|sass)$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }
        ]
    },
    
});
