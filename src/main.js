import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

import "./assets/css/global.css";

Vue.config.productionTip = false;

Vue.use(ElementUI);

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
});
Vue.prototype.$http = axios;

Vue.prototype.$message = ElementUI.Message;
Vue.prototype.$confirm = ElementUI.MessageBox.confirm;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
