<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title Welcome
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item 首页
    #gak-main-home
      #gak-main-home-title 欢迎使用
      hr#gak-main-home-hr
      #gak-main-home-content
        .gak-tip-blue 欢迎您使用 help-teacher 这款小软件。他是一个帮助老师的一个小工具,他的核心功能是为了解决老师收发作业繁琐的问题，
          |同时学习委员也能通过此软件方便的收取和管理作业。
          b 现在，您只要简单几步即可开始使用。
        el-row(:gutter="20")
          el-col(:span="2")
            v-icon(name="hand-point-right").gak-main-home-content-serial
          el-col(:span="20")
            .gak-main-home-content-li(@click="routePage('class')") 创建一个班级
        el-row(:gutter="20")
          el-col(:span="2")
            v-icon(name="hand-point-right").gak-main-home-content-serial
          el-col(:span="20")
            .gak-main-home-content-li(@click="routePage('job')") 创建一个作业
        el-row(:gutter="20")
          el-col(:span="2")
            v-icon(name="hand-point-right").gak-main-home-content-serial
          el-col(:span="20")
            .gak-main-home-content-li(@click="routePage('server')") 开启作业收取服务
        el-row(:gutter="20")
          el-col(:span="2")
            v-icon(name="hand-point-right").gak-main-home-content-serial
          el-col(:span="20")
            .gak-main-home-content-li(@click="routePage('monitor')") 学生网页访问上传
        el-row(:gutter="20")
          el-col(:span="2")
            v-icon(name="hand-point-right").gak-main-home-content-serial
          el-col(:span="20")
            .gak-main-home-content-li(@click="routePage('monitor')") 实时监控收取
</template>


<script>
  import { globalBus } from '@/utils/_global';
  export default {
  methods: {
    routePage:function (name) {
      this.$router.push({
        name: name
      });
      globalBus.$emit('changeMenu',name);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/home/index.styl';
</style>