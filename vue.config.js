/*
 * @name:
 * @Descripttion:
 * @Author: Morning
 * @Date: 2021-03-27 13:41:12
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-18 16:15:56
 */
"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const CopyWebpackPlugin = require("copy-webpack-plugin");

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 分析包

// externals: {
//   vue: 'Vue',
//   vuex: 'Vuex',
//   'vue-router': 'VueRouter',
//   axios: 'axios',
//   'element-ui': 'ELEMENT',
//   moment: 'moment',
//   xlsx: 'XLSX',
//   'particles.js': 'pJS',
//   html2canvas: 'html2canvas',
//   jquery: 'jQuery',
//   viewerjs: 'Viewer',
//   clipboard: 'ClipboardJS',
//   nprogress: 'NProgress'
// },

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    // vue: 'Vue',
    // vuex: 'Vuex',
    // 'vue-router': 'VueRouter',
    // axios: 'axios',
    // 'element-ui': 'ELEMENT',
    "BMap": "BMap",
  },
  // cdn的css链接
  css: ['https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/theme-chalk/index.min.css'],
  // cdn的js链接
  js: [
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.5.1/vue-router.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.min.js',
    'https://cdn.bootcdn.net/ajax/libs/axios/0.20.0/axios.min.js',
    'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/index.min.js',
    'http://api.map.baidu.com/api?v=2.0&ak=gMjlNwT7b8m4Vv6Lz6oeV1jN7N7Yv0Y2'
  ]
}

module.exports = {
  publicPath: "/",
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint 是否在保存时检查
  assetsDir: "static", // 配置js、css静态资源二级目录的位置
  // from  定义要拷贝的源文件
  // to      定义要拷贝到的目标文件夹
  // toType  file 或者 dir                        可选，默认是文件
  // force   强制覆盖前面的插件            可选，默认是文件
  // context                                            可选，默认base   context可用specific  context
  // flatten  只拷贝指定的文件               可以用模糊匹配
  // ignore  忽略拷贝指定的文件            可以模糊匹配
  configureWebpack: {
    name: "无锡市医疗设备共享平台",
    // 打包静态文件插件
    plugins: [new CopyWebpackPlugin([{ from: "./static", to: "static" }])], // , new BundleAnalyzerPlugin() 分析包
    resolve: {
      alias: {
        // vue$: "vue/dist/vue.esm.js", 或 runtimeCompiler: true
        "@": resolve("src")
      }
    },
    externals: cdn.externals
  },
  runtimeCompiler: true,
  chainWebpack: config => {
    // config.externals = cdn.externals
    // config.plugin("monaco").use(new MonacoWebpackPlugin());
    config.plugin("html").tap(args => {
      args[0].title = "无锡市医疗设备共享平台";
      // args[0].cdn = cdn
      args[0].minify = false
      return args;
    });

    // 配置svg文件
    config.module
      .rule("svg")
      .exclude.add(resolve("src/libs/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/libs/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  },
  productionSourceMap: false, // 生产生成 sourceMap 文件
  // "http://192.168.21.74:12699",
  // "http://192.168.8.19:30221",
  // "http://192.168.0.194:12698/",
  // "http://192.168.8.117:80"
  // "http://192.168.8.117:7997"
  // "http://192.168.21.74:7997/",
  // "http://www.app.dubcat.cn:8081/"
  devServer: {
    open: true,
    proxy: {
      // 代理
      "/api": {
        target: "http://www.app.dubcat.cn:8081/",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
        // cookiePathRewrite: { // 是否携带cookie
        //      '/svc-prod-app': '/'
        // }
      }
    }
  }
};
