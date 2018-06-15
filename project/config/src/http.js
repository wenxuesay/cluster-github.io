import axios from 'axios';
import { Message } from 'element-ui';
import router from './router';
import store from './store';
import util from './lib/util';


axios.defaults.timeout = 60000;
// http request 拦截器
// $axios.defaults.baseURL = "http://localhost:8083/";
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


// axios.interceptors.request.use(
//   config =>
//     // if(store.state.global.userToken){
//     //   // config.Authorization = `token ${store.state.currentUser.userToken}`;
//     //   config.headers["access-token"] = store.state.currentUser.userToken;
//     // }
//      config,
//   err => Promise.reject(err));

axios.interceptors.response.use(
  (res) => {
    // 取消lid对应的loading
    // if (res.data.code === 401) {
    //   store.commit('clearUserName');
    //   router.replace({
    //     path: '/401',
    //   });
    //   return res;
    // }
    // cas 跳转登录
    if (res.data.status === 'jump') {
    //   console.log(11132233);
      util.deleCookies();
      window.location.href = res.data.result.redirect;
    }
    // 全局统一出错处理
    if (res.data.status !== 'ok') {
      if (res.data.message) {
        Message.error(res.data.message);
        return res;
      }
    }
    if (res.data) {
      return res.data;
    }
    return res;
  },
  (error) => {
    // console.log(error);
    if (error.response.data && error.response.data.status) {
      Message.error(error.response.data.message);
    } else if (error.response) {
      switch (error.response.status) {
        case 401:
          store.commit('clearUser');
          router.replace({
            path: 'signIn',
            query: {
              redirect: router.currentRoute.fullPath,
            },
          });
          break;
        case 403:
          Message.error('没有权限');
          break;
        case 500:
          Message.error('系统错误');
          break;
        default:
          Message.error('系统错误');
          break;
      }
    }
    return Promise.reject(error);
  });
export default axios;
