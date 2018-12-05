<template lang="pug">
  #gak-main
    #gak-main-head
      span#gak-main-head-title Welcome
</template>
<style lang="stylus">
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
    about(item, index) {
      this.$router.push({ name: "about" });
    },
    student(item, index) {
      this.$router.push({ name: "student" });
    }
  }
};
</script>