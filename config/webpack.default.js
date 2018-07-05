const path=require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack=require("webpack")
const CopyWebpackPlugin = require('copy-webpack-plugin')

process.env.mode = 'development'

module.exports={
    entry:'./page/index.js',
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'bundle.js'
    },
    // devtool:'source-map',
    devServer: {
	    contentBase:path.resolve(__dirname,'../page'),//本地服务器所加载的页面所在的目录
	    historyApiFallback: true,//不跳转
      publicPath:'/',
      host:"0.0.0.0",
	    inline: true,//实时刷新
        hot:true,
        index:"main.html"
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress:false,
          },
          cache: true,
          include:path.resolve(__dirname,'../src')
        })
      ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: 'PIXI', // html5文件中<title>部分
            filename: 'main.html', // 默认是index.html，服务器中设置的首页是index.html，如果这里改成其它名字，那么devServer.index改为和它一样，最终完整文件路径是output.path+filename，如果filename中有子文件夹形式，如`./ab/cd/front.html`，只取`./front.html`
            template: path.resolve(__dirname,'../page/index.html'), //如果觉得插件默认生成的hmtl5文件不合要求，可以指定一个模板，模板文件如果不存在，会报错，默认是在项目根目录下找模板文件，才模板为样板，将打包的js文件注入到body结尾处
            inject:'body', // true|body|head|false，四种值，默认为true,true和body相同,是将js注入到body结束标签前,head将打包的js文件放在head结束前,false是不注入，这时得要手工在html中加js
        }),

        new webpack.HotModuleReplacementPlugin(),
         // copy custom static assets
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*']
          }
        ])

        // new ExtractTextPlugin("styles.css"),
    ],
    resolve: {
        extensions: [ '.ts', '.js']
    },
    module:{
        rules:[
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader"
                        }, {
                            loader: "css-loader"
                        }
                    ]
                  },
                  {
                      test:/\.ts$/,
                           exclude: /(node_modules|bower_components)/,
                      use:[{
                              loader: 'babel-loader',
                              // options: {
                              //   presets: ['es5']
                              // }
                            },
                          {loader:'ts-loader'},
                           
                      ],
                        include:[path.resolve(__dirname,'../src'),path.resolve(__dirname,'../page')],
                  }
        ]
    }
}