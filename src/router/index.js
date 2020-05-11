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
    component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home'),
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: () => import(/* webpackChunkName: "welcome" */ '../views/Welcome')},
      {path: '/users', component: () => import(/* webpackChunkName: "users" */ '../components/user/Users')},
      {path: '/rights', component: () => import(/* webpackChunkName: "rights" */ '../components/authority/Rights')},
      {path: '/roles', component: () => import(/* webpackChunkName: "rights" */ '../components/authority/Roles')},
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
