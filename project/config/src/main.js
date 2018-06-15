// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import echarts from 'echarts';

import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import 'animate.css';
import './assets/style.scss';
import '../static/css/font-awesome.css';
import router from './router';
import store from './store';
import axios from './http';
import App from './App';

// require('vue2-scrollbar/dist/style/vue2-scrollbar.css');

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.use(Vuex);
Vue.use(ElementUI);
// Vue.use(VueScrollbar);


/* eslint-disable no-new */
// new PerfectScrollbar('#app');
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
