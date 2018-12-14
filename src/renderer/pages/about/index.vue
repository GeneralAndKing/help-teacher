<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title About
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item 关于
    #gak-main-about.gak-flex-center.gak-flex-column
      img(src="@/assets/logo.png")
      hr.gak-hr
      h1#gak-main-about-title-1(@click="goGithub(githubgak)") General And King
      h2#gak-main-about-title-2 One
      p#gak-main-about-content 非常感谢您使用我们的这款小而不太精致的软件，如有问题请随时反馈到github，传送门在下面。如果您觉得不错，欢迎 star，如果您是开发者，欢迎 fork 和 pull request。
      img#gak-main-about-github(src="@/assets/github.png", @click="goGithub(githubUrl)")
</template>


<script>
  const shell = require('electron').shell;
  export default {
    data() {
      return {
        githubgak: 'https://github.com/GeneralAndKing',
        githubUrl: 'https://github.com/GeneralAndKing/help-teacher',
      }
    },
    methods: {
      goGithub: function (url) {
        shell.openExternal(url);
      },
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../styles/about/index.styl"
</style>

