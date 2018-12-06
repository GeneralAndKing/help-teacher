<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title homework
</template>
<style lang="stylus" scoped>
  @import "../../styles/job/index.styl"
</style>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    };
  },
  methods: {
    about(item, index) {
      this.$router.push({ name: "about" });
    },
    student(item, index) {
      this.$router.push({ name: "student" });
    }
  }
};
</script>