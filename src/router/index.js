import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "first" */ '../views/Login'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "first" */ '../views/Home'),
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: () => import(/* webpackChunkName: "first" */ '../views/Welcome')},
      {path: '/users', component: () => import(/* webpackChunkName: "first" */ '../components/user/Users')},
      {path: '/rights', component: () => import(/* webpackChunkName: "first" */ '../components/authority/Rights')},
      {path: '/roles', component: () => import(/* webpackChunkName: "first" */ '../components/authority/Roles')},
      {path: '/categories', component: () => import(/* webpackChunkName: "second" */ '../components/goods/Category')},
      {path: '/params', component: () => import(/* webpackChunkName: "second" */ '../components/goods/Params')},
      {path: '/goods', component: () => import(/* webpackChunkName: "second" */ '../components/goods/GoodsList')},
      {path: '/goods/add', component: () => import(/* webpackChunkName: "second" */ '../components/goods/GoodsAdd')},
      {path: '/orders', component: () => import(/* webpackChunkName: "second" */ '../components/order/Order')},
      {path: '/reports', component: () => import(/* webpackChunkName: "second" */ '../components/report/Report')},
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    //  错误写法，因为此时则会使得陷入死循环直到内存溢出
    // return next('/login');
    return next();
  }
  let token = sessionStorage.getItem('token');
  if (!token) {
    return next('/login');
  }
  next();
});

export default router
