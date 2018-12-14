<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title ClassJob
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item(:to="{ path: '/class' }") 班级
        el-breadcrumb-item 作业
    el-scrollbar#gak-main-content-job
      el-alert(v-if='classToJobs.length === 0', title='当前班级无数据', type='info', center='', show-icon='')
      template(v-for='(classToJob, key) in classToJobs')
        el-col(:span='8')
          el-card.gak-job(shadow="hover")
            .gak-job-do
              el-button(type='danger', icon='el-icon-close', @click="handleDelete(key, classToJob)", circle,  size="mini")
            #gak-job-content(@click="handleInfo(key, classToJob)", align="left") 作业:
              .gak-job-head
                .gak-job-title {{ classToJob.jobName }}
              .gak-job-content.gak-text-hidden  {{ classToJob.startTime }}
              .gak-job-footer.gak-text-left.gak-text-hidden 状态:
                span(v-if="classToJob.status === 0") &nbsp;未开始
                span(v-if="classToJob.status === 1") &nbsp;收取中
                span(v-if="classToJob.status === 2") &nbsp;收取完成


</template>
<script>
const { getJobDb, getClassToJobDb } = require("@/api/db");
const { ipcRenderer, remote } = require("electron");
const { error, success, warning } = require("@/api/message");
export default {
  name: "ClassJob",
  data() {
    return {
      classToJobs: []
    };
  },
  mounted() {
    //保持环境
    let _this = this;
    let classToJobDb = getClassToJobDb();
    classToJobDb
      .findByClassName(_this.$route.params.className)
      .exec((error, classToJobJsons) => {
        _this.classToJobs = classToJobJsons;
      });
  },
  methods: {
    /**
     * 删除事件
     *
     * @param key 编辑的数组的元素角标
     * @param classToJob 编辑的元素
     */
    handleDelete: function(key, classToJob) {
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
    handleInfo: function(key, classToJob) {
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

<style lang="stylus" scoped>
@import '../../../styles/job/index.styl';
</style>
