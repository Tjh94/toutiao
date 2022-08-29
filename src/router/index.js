import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 根路由
    redirect: '/login'
  },
  {
    path: '/login', // 根路由
    component: () => import('../views/login/login.vue')
  }
  // {
  //   path: '/about',
  //   name: 'about',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  // 通过component属性中使用箭头函数的形式加载组件的文件资源，，实现按需加载的功能，只有在使用到该路由时，才会进入组件的加载，作用：提高第一次优化的性能
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
