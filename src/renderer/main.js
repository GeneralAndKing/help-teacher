import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import Common from './utils/index'
import GLOBAL from './utils/_global'


Vue.use(ElementUI);
Vue.prototype.global = GLOBAL;
Vue.prototype.$startLoading = function(loadStr) {
  return this.$loading({
    lock: true,
    text: loadStr || 'Loading ...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
};

const Store = require('electron-store');
Vue.prototype.$globalStore = new Store();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
