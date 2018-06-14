var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var dir = path.resolve(__dirname);
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserWebpackPlugin=require('open-browser-webpack-plugin');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
var templateTitle = '陈一心基金2018年年报';

var index = {
    title: templateTitle, // html5文件中<title>部分
    filename: 'index.html', // 默认是index.html，服务器中设置的首页是index.html，如果这里改成其它名字，那么devServer.index改为和它一样，最终完整文件路径是output.path+filename，如果filename中有子文件夹形式，如`./ab/cd/front.html`，只取`./front.html`
    template: './src/index.html', //如果觉得插件默认生成的hmtl5文件不合要求，可以指定一个模板，模板文件如果不存在，会报错，默认是在项目根目录下找模板文件，才模板为样板，将打包的js文件注入到body结尾处
    inject: 'body', // true|body|head|false，四种值，默认为true,true和body相同,是将js注入到body结束标签前,head将打包的js文件放在head结束前,false是不注入，这时得要手工在html中加js
    chunks: ['index']
}

var base = {
    title: templateTitle, 
    filename: 'base.html',
    template: './src/base.html',
    inject: 'body', 
    chunks: ['base']
}

module.exports = {
	mode: 'development',
	entry: { 
		index: path.resolve(dir,'src/js/index.js'), //入口文件,
		base: path.resolve(dir,'src/js/base.js') 
	},
	output: {
		filename: './js/[name].bundle.js',
		path: path.resolve(dir,'dist'),
	},
	// devtool: 'source-map',
	// devServer: {
	// 	contentBase: 'dist',
	// 	inline: true,
	// 	open: true,
	// },
	module: {
		rules: [
		    {
	    		test: /\.js$/,
	    		exclude: [
	    			/node_modules/,
	    			path.resolve(dir,'lib')
	    		],
	    		use: [
	    			{
		    			loader: 'babel-loader',
		    			options: {
		    				presets: ['es2015'],
		    				plugins: ['transform-runtime']
		    			}
		    		}
	    		]
		    },
		    {
                // 图片加载器
                test:/\.(png|jpg|gif|jpeg)$/,
		        use: [
		        	{
		        		loader: 'file-loader',
		        		options: {
		        			outputPath: 'img/',
		        			name: '[path][name].[ext]'
		        		}
		        	},
		        	// {
			        //     loader: 'url-loader',
			        //     options: {
			        //     	limit: 8192,
			        //     	name: 'img/[name].[ext]',			            
			        //     }
			        // },
		        ],
            },
	     //    {
		    //     test: /\.less$/,
		    //     use: ['style-loader','css-loader','postcss-loader','less-loader']
		    // },
		    // {
		    //     test: /\.less$/,
		    //     use: ExtractTextPlugin.extract({
		    //     	fallback: "style-loader",
		    //     	use: ['css-loader','postcss-loader','less-loader']
		    //     })
		    // }
		]
	},
	plugins: [
    	new webpack.WatchIgnorePlugin([dir + 'node_modules']),
    	// new webpack.HotModuleReplacementPlugin(),
    	new HtmlWebpackPlugin(index),
    	new HtmlWebpackPlugin(base),
    	// new CleanWebpackPlugin(['dist']),
    	// new ExtractTextPlugin("style.css"),
        new webpack.DllReferencePlugin({
	    	context: __dirname,
	    	manifest: require('./dist/js/manifest.json'),
	    }),
    	// new BundleAnalyzerPlugin(),
	],
	optimization: {
		splitChunks: {
	    chunks: "all",
	    minSize: 30000,
	    minChunks: 1,
	    name: true,
	    cacheGroups: {
	        	default: false,
		        vendors: {
		            test: /[\\/]node_modules[\\/]/,
		            priority: -10,
		        }
	    	}
		}
	},
}








