<template lang="pug">
  #app
    el-container
      el-header(class="header" height="30px")
        titlebar
      el-container
        el-aside(width="150px")
          sidebar
        el-main
          router-view
    el-scrollbar
</template>

<style lang="stylus">
  #app
    font-family "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif
    text-align center

  .header
    -webkit-app-region drag
    background-color #409EFF
    padding 0px
    padding-right 3px
    line-height 30px
    color #303133

  *
    padding 0px
    margin 0px
  html
    Overflow hidden
    

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
