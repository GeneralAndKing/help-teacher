<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title 随机点名
    #gak-main-call
      #gak-main-call-class.gak-tip-blue
        span 请选择您的班级：
        el-select(v-model='classIndex', placeholder='请选择')
          el-option(v-for='(classJson,index) in classJsons', :key='index', :label='classJson.className', :value='index')

      #gak-main-call-content {{ order }}
      el-button(v-if="interval == null &&classIndex!=null", type="success", @click="start") start
      el-button(v-if="interval != null &&classIndex!=null", type="danger", @click="stop") stop
</template>

<script>
const { getClassDb } = require("@/api/db");
const { error, success, warning } = require("@/api/message");
export default {
  name: "Call",
  data() {
    return {
      order: "等待开始",
      interval: null,
      classJsons: [],
      classIndex: null,
      students: []
    };
  },
  mounted() {
    let _this = this;
    let classDb = getClassDb();
    classDb.findAllClass().exec((e, classJsons) => {
      if (e) {
        error(_this, "数据错误");
      } else {
        _this.classJsons = classJsons;
      }
    });
  },
  methods: {
    start: function() {
      let time = 20;
      let _this = this;
      const num = _this.classJsons[_this.classIndex].students.length - 1;
      _this.interval = setInterval(() => {
        let random = _this.randomNumBoth(0, num);
        _this.order = _this.classJsons[_this.classIndex].students[random].name;
      }, time);
    },
    randomNumBoth: function(min, max) {
      let range = max - min;
      let rand = Math.random();
      return min + Math.round(rand * range);
    },
    stop: function() {
      let _this = this;
      if (_this.interval != null) {
        window.clearInterval(_this.interval);
        _this.interval = null;
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../styles/call/index.styl';
</style>