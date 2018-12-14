import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import VueCountdown from '@chenfengyuan/vue-countdown';
// 仅引入用到的图标以减小打包体积
// import 'vue-awesome/icons/flag'
// 或者在不关心打包体积时一次引入全部图标
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import VuejsDialog from 'vuejs-dialog'
// 自定义时引入
// import VuejsDialogMixin from 'vuejs-dialog/vuejs-dialog-mixin.min.js';
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
// 全局注册（在 `main .js` 文件中）
Vue.use(VuejsDialog);
Vue.component('v-icon', Icon);
Vue.component(VueCountdown.name, VueCountdown);
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
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
