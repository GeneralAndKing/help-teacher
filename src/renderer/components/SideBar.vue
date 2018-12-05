<template lang="pug">
  el-col(:span="18" id="sideBar")
    el-menu(router active-text-color="#ffffff")
      el-menu-item(index="/")
        i.el-icon-menu &nbsp;&nbsp;主页
          <!--el-badge.mark(:value="12" type="primary" :max="10" )-->
      el-menu-item(index="/class")
        i.el-icon-edit &nbsp;&nbsp;班级管理
      el-menu-item(index="/job")
        i.el-icon-question &nbsp;&nbsp;作业管理
      el-menu-item(index="/server")
        i.el-icon-question &nbsp;&nbsp;作业收取
</template>

<style lang="stylus">
  @import "../styles/components/SideBar.styl"
</style>

