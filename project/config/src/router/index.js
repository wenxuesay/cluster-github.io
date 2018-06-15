import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';
import main from './main';
import E401 from '../components/401';
import E404 from '../components/404';

Vue.use(VueRouter);
const routeIndex = [{
  path: '/401',
  component: E401,
}, {
  path: '*',
  component: E404,
},
];

const routes = [].concat(main, routeIndex);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes,
});

router.beforeEach((to, from, next) => {
  // 中止之前加入的请求
  // 权限控制
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.global.auth) {
      const flag = to.meta.requireAuth.every(v => store.state.global.auth.includes(v));
      if (flag) {
        next();
      } else {
        next({
          path: '401',
          query: { redirect: to.fullPath },
        });
      }
      next();
    } else {
      next({
        path: '401',
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});
router.afterEach((route) => {
  let documentTitle = 'cluster';
  route.matched.forEach((path) => {
    if (path.meta.title) {
      documentTitle += ` - ${path.meta.title}`;
    }
  });
  document.title = documentTitle;
});
export default router;
