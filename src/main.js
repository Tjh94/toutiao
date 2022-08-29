import Vue from 'vue'
import App from './App.vue'
// index 文件可以被快捷路径所忽略
// index命名的文件对于功能的可读性是非常差

// 动态设置rem加载
// 动态设置rem加载 - 在js代码中应该把所以的import引入模块的代码放到文件的最上方
import 'amfe-flexible'

import router from './router/index.js'
import store from './store/index.js'
// 引入字体图标
import './style/icon.less'

// 引入vant
// import Vue from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'

// 全局样式
// 全局样式一定要卸载组件样式表的下面，全局样式可以影响组件样式
import './style/index.less'

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
