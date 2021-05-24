/*
 * @name:
 * @Descripttion:
 * @Author: Morning
 * @Date: 2021-03-27 13:41:12
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-22 17:28:11
 */
"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  publicPath: "./",
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
    name: "管理系统",
    // 打包静态文件插件
    plugins: [new CopyWebpackPlugin([{ from: "./static", to: "static" }])],
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "XX市家庭医生签约平台";
      return args;
    }),
      // 配置svg文件
      // set svg-sprite-loader
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
  productionSourceMap: true, // 生产生成 sourceMap 文件
  devServer: {
    open: true,
    proxy: {
      // 代理
      "/api": {
        target: "http://61.177.141.230:50000",
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