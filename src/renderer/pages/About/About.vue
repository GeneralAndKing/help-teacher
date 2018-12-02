<template lang="pug">
  div
    #descDiv
      h3 electron + vue + element = cool desktop app
      p 如有问题请随时反馈到github，传送门在下面。欢迎star/fork。
      el-button(type="primary" @click="goGithub" plain) View On Github
</template>

<style lang="stylus">
#descDiv
  text-align left
</style>

<script>
const shell = require('electron').shell
export default {
  data() {
    return {
      githubUrl: 'https://github.com/williamfzc/BaseDesktopApp',
    }
  },
  methods: {
    goGithub: function() {
      shell.openExternal(this.githubUrl)
    },
  }
}
</script>
