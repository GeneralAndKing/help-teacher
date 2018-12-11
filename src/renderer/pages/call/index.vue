<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title 随机点名
    #gak-main-call
      #gak-main-call-class.gak-tip-blue
        span 请选择您的班级：
        el-select(v-model='select', placeholder='请选择')
          el-option(v-for='(item,index) in classes', :key='index', :label='item', :value='item')

      #gak-main-call-content {{ order }}
      el-button(v-if="interval == null", type="success", @click="start") start
      el-button(v-else, type="danger", @click="stop") stop
</template>

<script>
  export default {
    name: "Call",
    data() {
      return {
        order: '等待开始',
        interval: null,
        classes: ['2016软件工程','2017软件工程','2018软件工程'],
        select:'',
        students: [
          {
            id: "201607010244",
            name: "睿哥1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥2",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥3",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥4",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥5",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥6",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥7",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥8",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥9",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥10",
            sex: "男"
          }
        ]
      };
    },
    methods: {
      start: function () {
        let time = 20;
        let _this = this;
        const num = _this.students.length - 1;
        _this.interval = setInterval(() => {
          let random = _this.randomNumBoth(0, num);
          _this.order = _this.students[random].name;
        }, time);
      },
      randomNumBoth: function (min, max) {
        let range = max - min;
        let rand = Math.random();
        return min + Math.round(rand * range);
      },
      stop: function () {
        let _this = this;
        if (_this.interval != null) {
          window.clearInterval(_this.interval);
          _this.interval = null;
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../styles/call/index.styl"
</style>