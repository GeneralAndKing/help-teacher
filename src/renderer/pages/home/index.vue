<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1);")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Welcome
</template>
<style lang="stylus" scoped>
  @import "../../styles/home/index.styl"
</style>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    };
  },
  methods: {

  }
};
</script>