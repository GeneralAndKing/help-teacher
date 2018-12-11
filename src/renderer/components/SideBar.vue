<template lang="pug">
  el-col(:span="18", id="sideBar")
    el-menu(router, active-text-color="#ffffff")
      template(v-for="(nav, index) in navList")
        el-menu-item(:index="nav.name")
          i(v-if="nav.el", :class="nav.icon")
          v-icon(v-else, :name="nav.icon")
          | &nbsp;&nbsp;{{nav.navItem}}
</template>

<script>

  export default {
    data() {
      return {
        navList: [
          {name: '/', navItem: '主页', icon: 'home'},
          {name: '/class', navItem: '班级管理', icon: 'user-graduate', el: false},
          {name: '/job', navItem: '作业管理', icon: 'address-book', el: false},
          {name: '/server', navItem: '作业收取', icon: 'laptop', el: false},
          {name: '/monitor', navItem: '实时监控', icon: 'clock', el: false},
          {name: '/tool', navItem: '其他工具', icon: 'wrench', el: false}
        ]
      };
    }
  }
</script>

<style lang="stylus">
  @import "../styles/components/SideBar.styl"
</style>

