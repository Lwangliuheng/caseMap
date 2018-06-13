// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from "axios";
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.$ajax = axios;

let url = 'https://survey.zhongchebaolian.com/boot-pub-survey-manage'; // 测试环境
// let url = 'https://chakan.zhongchebaolian.com/boot-pub-survey-manage'; // 生产环境
// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log(config.data);
  config.url = url + config.url;
  return config;

}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
