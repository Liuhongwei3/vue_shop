import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios';

import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

import _ from 'lodash'

import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

import "./assets/css/global.css";

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.use(VueQuillEditor, /* { default global options } */)

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
});
axios.interceptors.response.use(config => {
  NProgress.done();
  return config;
});
Vue.prototype.$http = axios;

Vue.prototype.$message = ElementUI.Message;
Vue.prototype.$confirm = ElementUI.MessageBox.confirm;

Vue.filter('dateFormat', originVal => {
  const date = new Date(originVal);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1 + '').padStart(2, '0');
  const day = (date.getDay() + '').padStart(2, '0');
  const hour = (date.getHours() + '').padStart(2, '0');
  const minute = (date.getMinutes() + '').padStart(2, '0');
  const second = (date.getSeconds() + '').padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
