<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title 作业详情
    el-scrollbar#gak-main-info
      #gak-main-info-head {{ className }}{{ jobName }}收取情况
      #gak-main-content
        #gak-main-chart(style='width: 600px;height:400px;')
        el-table(:data='unfinishedStudents', style='width: 100%', :row-class-name='bgDanger')
          el-table-column(type='index', width='50', align="center")
          el-table-column(prop='id', label='学号')
          el-table-column(prop='name', label='姓名')
          el-table-column(label='性别', prop='sex', sortable)
            template(slot-scope='scope')
              el-tag(:type="scope.row.sex === '男' ? 'primary' : 'danger'") {{scope.row.sex}}


</template>

<script>
  export default {
    name: "ClassJobInfo",
    data() {
      return {
        className: "2016计算机科学与技术",
        jobName: "交互设计",
        startTime: "2018年12月12日",
        stopTime: 30,
        unfinishedNum: 12,
        finishedNum: 18,
        status: 2,
        unfinishedStudents: [{
          name: "樊总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }, {
          name: "睿总",
          id: "201607010244",
          sex: "男"
        }],
        option :{
          title: {
            text: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['已交人数', '未交人数']
          },
          color:['#9CF', '#F66'],
          series: [
            {
              name: '作业情况',
              type: 'pie',
              radius: '80%',
              center: ['50%', '55%'],
              data: [
                {value: 18, name: '已交人数'},
                {value: 25, name: '未交人数'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      };
    },
    mounted() {
      let _this = this;
      let myChart = _this.$echarts.init(document.getElementById("gak-main-chart"));
      myChart.setOption(_this.option);
    },
    methods:{
      bgDanger: function () {
        return "bg-danger";
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../styles/job/info/index.styl"
</style>
