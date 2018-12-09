<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1);")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Class
    el-scrollbar#gak-main-content-class
      el-table(:data='classToJobs.filter(data => !search || data.className.toLowerCase().includes(search.toLowerCase()))', stripe,  v-loading="loading")
        el-table-column(type='index', width='40', align="center")
        el-table-column(label='班级', prop="className", align="center")
        el-table-column(label='人数', prop='studentNum', width="50px", align="center")
        el-table-column(label='开始时间', prop='startTime',  sortable, align="center")
        el-table-column(label='状态', prop='status', width="80px", sortable, align="center")
          template(slot-scope='scope')
            el-tag(type='info', v-if="scope.row.status === 0") 未开启
            el-tag(type='warning', v-if="scope.row.status === 1") 收取中
            el-tag(type='success', v-if='scope.row.status === 2') 已完成
        el-table-column(align="center")
          template(slot='header', slot-scope='scope')
            el-input(v-model='search', size='mini', placeholder='输入班级搜索', style="max-width:250px;float:right;", clearable)
          template(slot-scope='scope')
            el-button(size='mini', @click='handleInfo($event,scope.$index, scope.row)' ) 详情
            el-button(size='mini', type='danger', @click='handleDelete(scope.$index, scope.row)' ) 删除

</template>

<script>
  const {readClassXlsx} = require("../../../api/xlsx");
  const {verifyStudentUnique} = require("../../../api/judge");
  const {getClassDb} = require("../../../api/db");
  const {error, success, warning} = require("../../../api/message");
  const {ipcRenderer, remote} = require("electron");
  export default {
    data() {
      return {
        loading: true,
        search: '',
        classToJobs: [{
          className: "2016软件工程",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016啊萨斯的",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计浮动浮动术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 0,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 1,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        },{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "2018年12月12日",
          stopTime: 30,
          studentNum: 68,
          status: 2,
          unfinishedPeoples: [{
            name: "樊总",
            id: "201607010244",
            sex: "男"
          }, {
            name: "睿总",
            id: "201607010244",
            sex: "男"
          }]
        }]
      };
    },
    mounted() {
      // let _this = this;
      // let classDb = getClassDb();
      // classDb.findAllClass().exec((error, classJsons) => {
      //   for (const classJson of classJsons) {
      //     _this.tableData.push({
      //       className: classJson.className,
      //       studentNum: classJson.students.length
      //     });
      //   }
      // });
      setTimeout(() => {
        this.loading = false;
      }, 1000)
    },
    methods: {
      handleDelete(index, row) {
        let _this = this;
        // let ClassDb = remote.getGlobal("ClassDb");
        // let classDb = new ClassDb();
        success(_this, "删除成功");
      },
      handleInfo(index, row){

      }
    }
  };
</script>
<style lang="stylus">
  @import '../../../styles/job/class/index.styl';
</style>
