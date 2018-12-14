<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title Welcome
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item 首页
</template>


<script>
export default {
  methods: {}
};
</script>

<style lang="stylus" scoped>
@import '../../styles/home/index.styl';
</style>