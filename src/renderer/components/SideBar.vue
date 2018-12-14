<template lang="pug">
  el-col(:span="18", id="sideBar")
    el-menu(router, active-text-color="#ffffff", default-active="/")
      template(v-for="(nav, index) in navList")
        el-menu-item(:index="nav.name")
          i(v-if="nav.el", :class="nav.icon")
          v-icon(v-else, :name="nav.icon", :spin="nav.spin", :pulse="nav.pulse")
          | &nbsp;&nbsp;{{nav.navItem}}
</template>

<script>

  export default {
    data() {
      return {
        /**
         * name: 路径名称
         * navItem: 显示名称
         * icon： 图标名称
         * el： 是否使用 elementUI 的图标
         * spin： 是否连续旋转
         * pulse: 是否间断旋转
         */
        navList: [
          {name: '/', navItem: '主页', icon: 'home'},
          {name: '/class', navItem: '班级管理', icon: 'user-graduate'},
          {name: '/job', navItem: '作业管理', icon: 'address-book'},
          {name: '/server', navItem: '作业收取', icon: 'laptop'},
          {name: '/monitor', navItem: '实时监控', icon: 'cog', spin: true},
          {name: '/tool', navItem: '其他工具', icon: 'wrench'}
        ]
      };
    }
  }
</script>

<style lang="stylus">
  @import "../styles/components/SideBar.styl"
</style>

