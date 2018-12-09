<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title homework
    el-scrollbar#gak-main-content-job
      template(v-for='(classToJob, key) in classToJobs')
        el-col(:span='8')
          el-card.gak-job(shadow="hover")
            .gak-job-do
              el-button(type='danger', icon='el-icon-close', @click="handleDelete(key, job)", circle,  size="mini")
            .gak-job-head 作业:
              .gak-job-title {{ classToJob.jobName }}
            .gak-job-content.gak-text-hidden  {{ classToJob.startTime }}
            .gak-job-footer.gak-text-left.gak-text-hidden 状态:
              span(v-if="classToJob.status === 0") &nbsp;未开始
              span(v-if="classToJob.status === 1") &nbsp;收取中
              span(v-if="classToJob.status === 2") &nbsp;收取完成


</template>
<style lang="stylus" scoped>
  @import "../../../styles/job/index.styl"
</style>

<script>
  const {getJobDb} = require("../../../api/db");
  const {ipcRenderer, remote} = require("electron");
  const {error, success, warning} = require("../../../api/message");
  export default {
    name: "ClassJob",
    data() {
      return {
        classToJobs: [{
          className: "2016计算机科学与技术",
          jobName: "作业名字",
          startTime: "时间戳",
          stopTime: 30,
          studentNum: 68,
          status: 0,
          unfinishedPeoples:[{
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
      //保持环境
      let _this = this;
      let jobDb = getJobDb();
      jobDb.findAllJob().exec((error, jobs) => {
        for (const job of jobs) {
          _this.jobs.push({
            jobName: job.jobName,
            jobContent: job.jobContent,
            jobTypes: job.jobTypes
          })
        }
      })
    },
    methods: {
      /**
       * 删除事件
       *
       * @param key 编辑的数组的元素角标
       * @param classToJob 编辑的元素
       */
      handleDelete: function (key, classToJob) {
        let _this = this;

          _this.classToJobs.splice(classToJob, 1);
          // let JobDb = remote.getGlobal("JobDb");
          // let jobDb = new JobDb();
          // jobDb.deleteJob(job.jobName);
          success(_this, "删除成功");
      }
    }
  };
</script>