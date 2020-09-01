const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const path = require( 'path' );
const Webpack = require('webpack');
module.exports = {
    transpileDependencies: [
        "vuetify"
    ],
    configureWebpack: {
        plugins: [
            new Webpack.ProvidePlugin({
                'window.Quill': ['quill'],
                'window.katex': ['katex'],
            }),
        ],
        performance: {
            hints: false
        },
        optimization: {
            splitChunks: {
                minSize: 10000,
                maxSize: 250000,
            }
        },
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'COJ'
                return args
            })
        config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
            {
                // Languages are loaded on demand at runtime
                languages: ['c', 'cpp', 'python']
            }
        ])
    }
};