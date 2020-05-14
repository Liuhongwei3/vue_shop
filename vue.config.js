/** https://liuhongwei3.github.io Inc.
 * Name: vue.config.js
 * Date: 2020/5/10 14:20
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      lodash: '_',
      echarts: 'echarts',
      nprogress: 'NProgress',
      'vue-quill-editor': 'VueQuillEditor',
    }
  }
};
