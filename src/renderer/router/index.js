import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

const routeOptions = [
  {path: '/', component: 'Home', name: 'home', dir: 'home'},
  {path: '/home', component: 'Home', name: 'home', dir: 'home'},
  {path: '/about', component: 'About', name: 'about', dir: 'about'},
  {path: '/server', component: 'Server', name: 'server', dir: 'server'},
  {path: '/tool', component: 'Tool', name: 'tool', dir: 'tool'},
  {path: '/class', component: 'Class', name: 'class', dir: 'class'},
  {path: '/job', component: 'Job', name: 'job', dir: 'job'},
  {path: '/class/student', component: 'Student', name: 'student', dir: 'class/student'},
  {path: '/class/job', component: 'ClassJob', name: 'class-job', dir: 'class/job'}
];

const routes = routeOptions.map(route => {
  return {
    ...route,
    component: () => import(`../pages/${route.dir}/index.vue`)
  }
});

export default new Router({
  routes: routes,
  mode: 'hash'
})
