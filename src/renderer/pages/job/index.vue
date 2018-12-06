<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title homework
    el-scrollbar#gak-main-content-job
      template(v-for='(job, key) in jobs')
        el-col(:span='8')
          el-card.gak-job(shadow="hover")
            .gak-job-head 作业:
              .gak-job-title {{ job.jobName }}
            .gak-job-content  {{ job.jobContent }}
            .gak-job-foot 作业类型:
              span(v-for="(type) in job.jobTypes") &nbsp;{{type.type}}


</template>
<style lang="stylus" scoped>
  @import "../../styles/job/index.styl"
</style>

<script>
  export default {
    data() {
      return {
        jobs: [
          {
            jobName: "第一次作业",
            jobContent: "具体详情是做什么的具体详情是做什么的具体详情是做什么体详情是做什么的具体详情是做什么的具体详情是做什么体详情是做什么的具体详情是做什么的具体详情是做什么体详情是做什么的具体详情是做什么的具体详情是做什么的具体详情是做什么的具体详情是做什么的具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              },
              {
                type: "word",
                state: "word格式的作业"
              }
            ]
          }, {
            jobName: "第二次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "rar",
                state: "rar格式"
              },
              {
                type: "ppt",
                state: "ppt格式的作业"
              }
            ]
          }, {
            jobName: "第三次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第四次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第五次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }, {
            jobName: "第六次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              }
            ]
          }
        ]
      };
    },
    methods: {}
  };
</script>