<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Server
    #gak-main-server
      el-container
        el-header
          el-steps(:active="active", align-center, finish-status='success')
            el-step(title="开始作业")
            el-step(title="设置作业")
            el-step(title="开启服务")
        el-main.basic
          el-form(:model="server" label-width="80px" label-position="left")
            transition(name="slide-fade", mode="out-in")
              .basicIndex(v-if="active===0", :key="0")
                el-form-item.gak-text-left(label="作业名称")
                  el-select(v-model='selectJob', placeholder='请选择')
                    el-option(v-for='job in jobs', :key='job.jobName', :label='job.jobName', :value='job.jobName')
                  span.gak-text-placeholder 没有作业？
                    a#gak-job-create(@click="createJob") 点击创建
                el-form-item(label="时间(分钟)")
                  el-slider(v-model="server.time", :min="10", :max="60", label="提交时间", show-input)
              .basicData(v-if="active===1", :key="1")
              .basicServer(v-if="active===2", :key="2")
                el-button(@click="openServer" type="primary") 开启服务
        el-footer
          el-button-group
            transition(name="el-fade-in", mode="out-in")
              el-button(type="primary" icon="el-icon-arrow-left" v-if="active!==0" @click="prev") 上一步
            transition(name="el-fade-in", mode="out-in")
              el-button(type="primary" icon="el-icon-arrow-right" v-if="active!==2" @click="next") 下一步

</template>
<style lang="stylus" scoped>
  @import "../../styles/server/index.styl"

</style>


<script>
  import {Loading} from "element-ui";
  import {runInNewContext} from "vm";
  import {clearInterval} from 'timers';

  const {ipcRenderer} = require("electron");
  const remote = require("electron").remote;
  const path = require("path");
  //接收主进程发来的消息
  // ipcRenderer.on("server-status", (event, data) => {
  //   setTimeout(() => {

  //   }, 2000);
  // });
  export default {
    data() {
      return {
        active: 0,
        server: {
          title: "",
          time: 0
        },
        selectJob: "",
        jobs: [
          {
            jobName: "第一次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              },
              {
                type: "ppt",
                state: "ppt格式的作业"
              }
            ]
          },
          {
            jobName: "第二次作业",
            jobContent: "具体详情是做什么的",
            jobTypes: [
              {
                type: "excel",
                state: "excel格式的作业"
              },
              {
                type: "ppt",
                state: "ppt格式的作业"
              }
            ]
          }
        ]
      };
    },
    methods: {
      openServer: function (event) {
        Loading.service({fullscreen: true});
        const webServer = remote.getGlobal("webServer");
        webServer.start(3000);
        Loading.service({fullscreen: true}).close();
      },
      prev: function (event) {
        if (this.active-- < 0) {
          this.active = 0;
        }
      },
      next: function (event) {
        if (this.active++ > 2) {
          this.active = 0;
        }
      },
      createJob: function () {
        this.$router.push({
          name: 'job'
        });
      }
    }
  };
</script>
