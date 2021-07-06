const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const fs = require('fs');
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
    },
    // devServer: {
    //     public: 'https://192.168.0.25:8080/',
    //     https: {
    //         key: fs.readFileSync('/home/doyeop/SSL/server.key'),
    //         cert: fs.readFileSync('/home/doyeop/SSL/server.crt'),
    //     },
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    //     },
    //     hot: true,
    //     disableHostCheck: true
    // },
};