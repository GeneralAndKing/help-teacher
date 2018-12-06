import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

const routeOptions = [
  {path: '/', component: 'Home', name: 'home'},
  {path: '/home', component: 'Home', name: 'home'},
  {path: '/about', component: 'About', name: 'about'},
  {path: '/server', component: 'Server', name: 'server'},
  {path: '/tool', component: 'Tool', name: 'tool'},
  {path: '/class', component: 'Class', name: 'class'},
  {path: '/job', component: 'Job', name: 'job'},
  {path: '/student', component: 'Student', name: 'student'}
];

const routes = routeOptions.map(route => {
  return {
    ...route,
    component: () => import(`../pages/${route.name}/index.vue`)
  }
});

export default new Router({
  routes: routes,
  mode: 'hash'
})
