const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭eslint检测
  // devServer: {
  //   overlay: {
  //     warnings: false,
  //     errors: false
  // },
  lintOnSave: false,
  // },

  //保存后自动格式化代码
  // chainWebpack: config => {
  //   config
  //     .plugin('eslint')
  //     .tap(args => {
  //       args[0].fix = true
  //       return args
  //     })
  // }
})


