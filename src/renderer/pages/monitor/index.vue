<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title Monitor
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item 监控
    el-scrollbar#gak-main-monitor
      el-tabs(v-model='activeName', @tab-click="tabChange")
        el-tab-pane(label='作业信息', name='first')
          #gak-main-monitor-tip
            el-alert.gak-text-left(:title="title", type="success", :closable="false",
            description="现在，请让学生在以下时间内上交作业，您可以自由控制暂停、继续与停止。")
            el-row(:gutter='20')
              el-col(:span='12') 班级名称
              el-col(:span='12') {{ className }}
            el-row(:gutter='20')
              el-col(:span='12') 作业名称
              el-col(:span='12') {{ jobName }}
            el-row(:gutter='20')
              el-col(:span='12') 开始时间
              el-col(:span='12') {{ startTime }}
            el-row(:gutter='20')
              el-col(:span='12') 时间间隔
              el-col(:span='12') {{ waitTime }}
        el-tab-pane(label='服务管理', name='second')
          #gak-main-monitor-time
            countdown(:time='time', ref="countdown", :transform="transform", @start="changStatus", 
            @end="end" )
              template(slot-scope='props')
                | {{ props.hours }} : {{ props.minutes }} : {{ props.seconds }}
          #gak-main-monitor-btn
            el-button(v-if="status", type="danger", @click="$refs.countdown.end()") 停止
            el-button(v-if="!status", type="success", @click="$refs.countdown.start()", v-bind:disabled="disabled" ) 继续

        el-tab-pane(label='监控进度', name='third')
          #gak-main-monitor-table
            .gak-tip-blue 在这里，您可以实时查看作业上交情况，并可以选择显示的是已上交的或未上交的
              el-switch(style='display: block', v-model='finishedShow', active-color='#13ce66', inactive-color='#ff4949', active-text='已上交', inactive-text='未上交',
              active-value=true, inactive-value=false, @change="switchChange")
            el-table(:data='tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))',
            style='width: 100%', stripe)
              el-table-column(type='index', width='40', align="center")
              el-table-column(label='学号', prop='id')
              el-table-column(label='姓名', prop='name')
              el-table-column(label='状态', width='80', align="center")
                template(slot-scope='scope')
                  el-tag(v-if='finishedShow', type="success", disable-transitions='') 已上交
                  el-tag(v-else, type="danger", disable-transitions='') 未上交
              el-table-column(label='性别', prop='sex', width='80px', sortable)
                template(slot-scope='scope')
                  el-tag(:type="scope.row.sex === '男' ? 'primary' : 'danger'", disable-transitions='') {{scope.row.sex}}
              el-table-column(width="170px")
                template(slot='header', slot-scope='scope')
                  el-input(v-model='search', placeholder='输入学号姓名', style="width:100%;max-width:300px;float:right;", clearable)
                template(slot-scope='scope')
                  span(v-if="scope.row.address != null") {{ scope.row.address }}
                  span(v-else) 无数据
        el-tab-pane.gak-text-center(label='数据可视', name='fourth')
          #gak-main-monitor-chart(style='width: 600px;height:400px;')


</template>

<script>
const { getClassToJobDb, getClassDb, getJobDb, getIpDb } = require("@/api/db");
const { error, success, warning } = require("@/api/message");
const { remote } = require("electron");
const { verifyNull } = require("@/api/judge");
export default {
  data() {
    return {
      activeName: "first",
      // 当计时器开始时，会默认调用一次 changStatus 方法
      // 默认为false，初始时会变成 true
      status: false,
      disabled: false,
      clock: false,
      search: "",
      title: "您的服务已成功开启，学生访问地址为:",
      // true为显示已完成的，false为显示未完成的
      finishedShow: true,
      tableData: [],
      className: null,
      jobName: null,
      startTime: null,
      time: null,
      waitTime: null,
      finishedStudents: [],
      unfinishedStudents: [],
      option: {
        title: {
          text: "IP 地址上传整图",
          subtext: "通过此数据，您可以查看到某个ip地址下上传的作业数量。"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} : {c}"
        },
        xAxis: {
          axisLabel: {
            interval: 0
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10,
          // x 轴的数据
          data: []
        },
        color: ["#39b0f2"],
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            name: "上传量",
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            // 阴影数据
            data: [],
            radius: "100%",
            barGap: "-100%",
            barCategoryGap: "40%",
            center: ["80%", "80%"]
          },
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: ""
              },
              emphasis: {
                color: ""
              }
            },
            // y 轴的数据
            data: []
          }
        ],
        charts: null
      }
    };
  },
  watch: {
    finishedShow: function(newFinished, oldFinished) {
      let _this = this;
      if (newFinished) {
        _this.tableData = _this.finishedStudents;
      } else {
        _this.tableData = _this.unfinishedStudents;
      }
    }
  },
  mounted: function() {
    let _this = this;
    let webServer = remote.getGlobal("webServer");
    if (
      !(
        verifyNull(webServer.getClassName()) &&
        verifyNull(webServer.getJobName())
      )
    ) {
      warning(_this, "你还没有开启过服务");
      return;
    }
    _this.title += webServer.getAddress();
    _this.option.series[1].itemStyle.normal.color = new _this.$echarts.graphic.LinearGradient(
      0,
      0,
      0,
      1,
      [
        { offset: 0, color: "#83bff6" },
        { offset: 0.5, color: "#188df0" },
        { offset: 1, color: "#188df0" }
      ]
    );
    _this.option.series[1].itemStyle.emphasis.color = new _this.$echarts.graphic.LinearGradient(
      0,
      0,
      0,
      1,
      [
        { offset: 0, color: "#2378f7" },
        { offset: 0.7, color: "#2378f7" },
        { offset: 1, color: "#83bff6" }
      ]
    );

    let classToJobDb = getClassToJobDb();
    classToJobDb.findByStatus(1).exec((e, classToJobJsons) => {
      if (e || classToJobJsons.length != 1) {
        error(_this, "数据出错");
      } else {
        let classToJobJson = classToJobJsons[0];
        _this.unfinishedStudents = classToJobJson.unfinishedStudents;
        _this.className = classToJobJson.className;
        _this.jobName = classToJobJson.jobName;
        _this.startTime = classToJobJson.startTime;
        _this.waitTime = classToJobJson.time;
        _this.time =
          classToJobJson.time * 60 * 1000 -
          (new Date().getTime() - classToJobJson.timestamp);
        let ipDb = getIpDb();
        ipDb.findAllAddress().exec((e, ipJsons) => {
          if (e) {
            error(_this, "数据出错");
          } else {
            _this.finishedStudents = ipJsons;

            //数据库的值获取完毕后进行其他操作;
            _this.tableData = _this.finishedStudents;
            let myChart = _this.$echarts.init(
              document.getElementById("gak-main-monitor-chart")
            );
            _this.charts = myChart;
            myChart.setOption(_this.option);
            /**
             * 同步操作
             */
            let ipDb = getIpDb();
            let synchronization = () => {
              ipDb.findAllAddress().exec((e, ipJsons) => {
                // //阴影部分
                // _this.option.series[0].data;
                // //数据
                // _this.option.series[1].data;
                // //ip
                // _this.option.xAxis.data;
                for (const ipJson of ipJsons) {
                  if (_this.option.xAxis.data.indexOf(ipJson.address) == -1) {
                    _this.option.xAxis.data.push(ipJson.address);
                    _this.option.series[0].data.push(20);
                    _this.option.series[1].data.push(1);
                  } else {
                    _this.option.series[0].data[
                      _this.option.xAxis.data.indexOf(ipJson.address)
                    ] += 1;
                  }
                }
                // myChart.clear();
                // myChart.setOption(_this.option);
              });
            };
            _this.interval = setInterval(synchronization(), 5000);
          }
        });
      }
    });
    _this.tableData = _this.finishedStudents;
  },
  beforeRouteLeave(to, from, next) {
    let _this = this;
    window.clearInterval(_this);
    next();
  },
  methods: {
    transform: function(props) {
      Object.entries(props).forEach(([key, value]) => {
        const digits = value < 10 ? `0${value}` : value;
        props[key] = `${digits} `;
      });
      return props;
    },
    changStatus: function() {
      let _this = this;
      _this.status = !_this.status;
    },
    end: function() {
      let webServer = remote.getGlobal("webServer");
      let _this = this;
      _this.status = !_this.status;
      _this.disabled = true;
      // webServer.stop();
    },
    /**
     * 切换显示
     */
    switchChange: function() {},
    /**
     *
     */
    tabChange: function(item) {
      // 加载图标
      let _this = this;
      if (item.index === "3") {
        // 重置动画效果
        if (_this.charts) {
          _this.charts.clear();
          _this.charts.setOption(_this.option);
        }
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../styles/monitor/index.styl';
</style>