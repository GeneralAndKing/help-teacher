<template lang="pug">
  div
    div(class="title") Information
    div(class="items")
      div(class="item")
        div(class="name") Path:
        div(class="value") {{ path }}
      div(class="item")
        div(class="name") Route Name:
        div(class="value") {{ name }}
      div(class="item")
        div(class="name") Vue.js:
        div(class="value") {{ vue }}
      div(class="item")
        div(class="name") Electron:
        div(class="value") {{ electron }}
      div(class="item")
        div(class="name") Node:
        div(class="value") {{ node }}
      div(class="item")
        div(class="name") Platform:
        div(class="value") {{ platform }}
</template>

<style scoped lang="stylus">
  .title
    color #888
    font-size 18px
    font-weight initial
    letter-spacing .25px
    margin-top 10px

  .items
    margin-top 8px

  .item
    display flex
    margin-bottom 6px


  .item .name
    color #6a6a6a
    margin-right 6px

  .item .value
    color #35495e
    font-weight: bold

</style>


<script>
  export default {
    data () {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
      }
    }
  }
</script>

