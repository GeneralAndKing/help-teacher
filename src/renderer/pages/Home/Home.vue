<template lang="pug">
  el-row(type="flex" class="row-bg" justify="space-around")
    el-col(:span="6")
      el-card
        img(class="image")
        span 学生信息管理
        div
          el-button(type="primary" @click="student") click
    el-col(:span="6")
      el-card
        img(class="image")
        span 作业收取
        div
          el-button(type="primary" @click="about") click
    el-col(:span="6")
      el-card
        img(class="image")
        span 其他工具
        div
          el-button(type="primary" @click="about") click
</template>
<style lang="stylus">
.image
  width 100%
  display block

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