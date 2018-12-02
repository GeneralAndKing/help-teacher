<template lang="pug">
  #app
    el-container
      el-header(class="header" height="30px")
        titlebar
      el-container
        el-aside
          sidebar
        el-main
          router-view
</template>

<style lang="stylus">
  #app
    font-family "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif
    text-align center

  .header
    -webkit-app-region drag
    background-color rgb(198,47,47)
    padding 0px
    padding-right 3px
    padding-bottom 2px
    line-height 30px
    box-shadow 2px 2px 1px #888888
    color #303133

  *
    padding 0px
    margin 0px

</style>

<script>
  import TitleBar from "./components/TitleBar.vue";
  import SideBar from "./components/SideBar.vue";

  export default {
    components: {
      titlebar: TitleBar,
      sidebar: SideBar
    }
  };
</script>
