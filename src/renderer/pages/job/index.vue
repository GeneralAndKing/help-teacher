<template lang="pug">
  #gak-main
    #gak-main-head
      h1 homework
</template>
<style lang="stylus">
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