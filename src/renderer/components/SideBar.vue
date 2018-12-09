<template lang="pug">
  el-col(:span="18", id="sideBar")
    el-menu(router, active-text-color="#ffffff")
      template(v-for="(nav, index) in navList")
        el-menu-item(:index="nav.name")
          i(:class="nav.icon")
          | &nbsp;&nbsp;{{nav.navItem}}
</template>

<script>
  export default {
    data() {
      return {
        navList: [
          {name: '/', navItem: '主页', icon: 'el-icon-menu'},
          {name: '/class', navItem: '班级管理', icon: 'el-icon-edit'},
          {name: '/job', navItem: '作业管理', icon: 'el-icon-setting'},
          {name: '/server', navItem: '作业收取', icon: 'el-icon-upload2'},
          {name: '/monitor', navItem: '实时监控', icon: 'el-icon-loading'}
        ]
      };
    }
  }
</script>

<style lang="stylus">
  @import "../styles/components/SideBar.styl"
</style>

