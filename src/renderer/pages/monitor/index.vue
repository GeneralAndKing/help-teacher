<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title 实时监控
    el-scrollbar#gak-main-monitor
      el-tabs(v-model='activeName')
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
              el-col(:span='12') {{ stopTime }}
        el-tab-pane(label='服务管理', name='second')
          #gak-main-monitor-time
            countdown(:time='time', ref="countdown", :transform="transform", @start="changStatus", @abort="changStatus",
            @end="end" )
              template(slot-scope='props')
                | {{ props.hours }} : {{ props.minutes }} : {{ props.seconds }}
          #gak-main-monitor-btn
            el-button(v-if="status", type="warning", @click="$refs.countdown.abort()") 暂停
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
        el-tab-pane(label='数据可视', name='fourth')




</template>

<script>

  export default {
    data() {
      return {
        time: 125000,
        activeName: 'first',
        // 当计时器开始时，会默认调用一次 changStatus 方法
        // 默认为false，初始时会变成 true
        status: false,
        disabled: false,
        clock: false,
        search: "",
        title: "您的服务已成功开启，学生访问地址为：10.2.21.25:8888",
        // true为显示已完成的，false为显示未完成的
        finishedShow: true,
        tableData: [],
        className: "2016级软件工程二班",
        jobName:"作业名字",
        startTime: "时间戳",
        stopTime: 30,
        finishedStudents: [
          {
            id: "201607010244",
            name: "睿睿睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿哥",
            address: "127.0.0.1",
            sex: "男"
          }
        ],
        unfinishedStudents: [
          {
            id: "201607010244",
            name: "睿阿斯顿仿盛大睿睿哥",
            sex: "男"
          }, {
            id: "201607010244",
            name: "萨达仿盛大发睿哥",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿萨达发萨达哥",
            sex: "男"
          }, {
            id: "201607010244",
            name: "睿萨达发哥",
            sex: "男"
          }
        ]
      }
    },
    watch: {
      finishedShow: function (newFinished, oldFinished) {
        let _this = this;
        console.log("new:" + newFinished);
        if (newFinished) {
          _this.tableData = _this.finishedStudents;
        } else {
          _this.tableData = _this.unfinishedStudents;
        }
      }
  },
    mounted: function () {
      let _this = this;
      _this.tableData = _this.finishedStudents;
    },
    methods: {
      transform: function (props) {
        Object.entries(props).forEach(([key, value]) => {
          const digits = value < 10 ? `0${value}` : value;
          props[key] = `${digits} `;
        });
        return props;
      },
      changStatus: function () {
        let _this = this;
        _this.status = !_this.status;
      },
      end: function () {
        let _this = this;
        _this.status = !_this.status;
        _this.disabled = true;
      },
      switchChange: function () {
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../styles/monitor/index.styl"
</style>