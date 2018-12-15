<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title Info
    el-scrollbar#gak-main-info
      #gak-main-info-head {{ classToJob.className }}{{ classToJob.jobName }}收取情况
      #gak-main-content
        #gak-main-chart(style='width: 600px;height:400px;')
        el-table(:default-sort="{prop: 'id',order: 'ascending'}", :data='classToJob.unfinishedStudents', style='width: 100%', :row-class-name='bgDanger')
          el-table-column(type='index', width='50', align="center")
          el-table-column(prop='id', label='学号', :sortable="true",  :sort-method="sortString")
          el-table-column(prop='name', label='姓名')
          el-table-column(label='性别',width='80' prop='sex', sortable)
            template(slot-scope='scope')
              el-tag(:type="scope.row.sex === '男' ? 'primary' : 'danger'") {{scope.row.sex}}
          el-table-column(label='操作' align="center")
            template(slot-scope='scope')
              el-button(size='mini', type='danger', @click='handleDelete(scope.$index, scope.row)') 未收取


</template>

<script>
const { getClassToJobDb } = require("@/api/db");
const { error, success, warning } = require("@/api/message");
export default {
  name: "ClassJobInfo",
  data() {
    return {
      chart: null,
      classToJob: {
        _id: null,
        className: null,
        jobName: null,
        startTime: null,
        stopTime: null,
        studentNum: null,
        status: null,
        unfinishedStudents: null
      },
      data: [{ value: 0, name: "未交人数" }, { value: 0, name: "已交人数" }],
      option: {
        title: {
          text: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["已交人数", "未交人数"]
        },
        color: ["#F66", "#9CF"],
        series: [
          {
            name: "作业情况",
            type: "pie",
            radius: "80%",
            center: ["50%", "55%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  created() {
    let _this = this;
    for (const arr in _this.$route.params.classToJob) {
      _this.classToJob[arr] = _this.$route.params.classToJob[arr];
    }
    _this.data[0].value = _this.classToJob.unfinishedStudents.length;
    _this.data[1].value = _this.classToJob.studentNum - _this.data[0].value;
  },
  mounted() {
    let _this = this;
    let myChart = _this.$echarts.init(
      document.getElementById("gak-main-chart")
    );
    //设置图表option
    _this.option.series[0].data = _this.data;
    myChart.setOption(_this.option);
    _this.chart = myChart;
  },
  methods: {
    sortString(v1, v2){
      return v1.id-v2.id;
    },
    bgDanger: function() {
      return "bg-danger";
    },
    handleDelete: function(key, student) {
      let _this = this;
      let callBack = function(e, docs) {
        if (e) {
          error(_this, "设置收取失败");
        } else {
          _this.classToJob.unfinishedStudents.splice(_this.classToJob.unfinishedStudents.indexOf(student), 1);
          _this.data[0].value = _this.classToJob.unfinishedStudents.length;
          _this.data[1].value =
            _this.classToJob.studentNum - _this.data[0].value;
          _this.option.series[0].data = _this.data;
          _this.chart.setOption(_this.option);
          success(_this, "收取成功");
        }
      };
      let classToJobDb = getClassToJobDb();
      classToJobDb.deleteUnfinishedStudentById(
        _this.classToJob._id,
        student.id,
        callBack
      );
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../styles/job/info/index.styl';
</style>
