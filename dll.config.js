const webpack = require('webpack');
const path = require('path');
const dir = path.resolve(__dirname);

const vendors = [
    'jquery',
    'swiper',
];

module.exports = {
    entry: {
        lib: vendors,
    },
    output: {
        path: path.join(dir,'dist/js'),
        filename: '[name].js',
        library: '[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(dir,'dist/js/manifest.json'),
            name: '[name]',
            context: __dirname,
        }),
    ],
};