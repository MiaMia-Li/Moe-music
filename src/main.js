import 'babel-polyfill'
import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'

fastclick.attach(document.body) // 移动端点击延时300ms

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router

})
