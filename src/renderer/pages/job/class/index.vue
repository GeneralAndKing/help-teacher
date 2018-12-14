<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title JobClass
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item(:to="{ path: '/job' }") 作业
        el-breadcrumb-item 班级
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
const { readClassXlsx } = require("@/api/xlsx");
const { verifyStudentUnique } = require("@/api/judge");
const { getClassDb, getClassToJobDb } = require("@/api/db");
const { error, success, warning } = require("@/api/message");
const { ipcRenderer, remote } = require("electron");
export default {
  data() {
    return {
      loading: true,
      search: "",
      classToJobs: []
    };
  },
  mounted() {
    let _this = this;
    let classToJobDb = getClassToJobDb();
    console.log(_this.$route.params.jobName);
    classToJobDb
      .findByJobName(_this.$route.params.jobName)
      .exec((error, classToJobJsons) => {
        console.log(classToJobJsons);
        _this.classToJobs = classToJobJsons;
        _this.loading = false;
      });
  },
  methods: {
    handleDelete: function(index, classToJob) {
      let _this = this;
      let callBack = function(error, docs) {
        if (error) {
          error(_this, "删除失败");
        } else {
          _this.classToJobs.splice(classToJob, 1);
          success(_this, "删除成功");
        }
      };
      let classToJobDb = getClassToJobDb();
      classToJobDb.deleteClassToJob(
        classToJob.jobName,
        classToJob.className,
        callBack
      );
    },
    handleInfo: function(index, classToJob) {
      let _this = this;
      _this.$router.push({
        name: "class-job-info",
        params: {
          classToJob: classToJob
        }
      });
    }
  }
};
</script>
<style lang="stylus">
@import '../../../styles/job/class/index.styl';
</style>
