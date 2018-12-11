<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title 服务
    #gak-main-server
      el-container
        el-header
          el-steps(:active="active", align-center, finish-status="success")
            el-step(title="开始作业")
            el-step(title="设置班级")
            el-step(title="开启服务")
        el-main.basic
          el-form(:model="form" label-width="80px" label-position="left")
            transition(name="slide-fade", mode="out-in")
              .basicStart(v-if="active===0", :key="0")
                el-alert.gak-text-left(title="开始使用", type="success", description="您只需要简单的三步即可开启本次作业的收取！现在，请选择您要开启的作业。")
                el-form-item.gak-text-left(label="作业")
                  el-select(v-model="form.jobName", placeholder="请选择")
                    el-option(v-for="jobJson in jobJsons", :key="jobJson.jobName", :label="jobJson.jobName", :value="jobJson.jobName")
                  span.gak-text-placeholder 没有作业？
                    a.gak-job-create(@click="createJob") 点击创建
                el-form-item(label="时间(分钟)")
                  el-slider(v-model="form.time", :min="1", :max="120", label="提交时间", show-input)
              .basicData(v-if="active===1", :key="1")
                el-alert.gak-text-left(title="设置班级", type="success", description="接下来，请选择您要开启的班级。")
                el-form-item.gak-text-left(label="班级")
                  el-select(v-model="form.className", placeholder="请选择")
                    el-option(v-for="classJson in classJsons", :key="classJson.className", :label="classJson.className", :value="classJson.className")
                  span.gak-text-placeholder 没有班级？
                    a.gak-job-create(@click="createClass") 点击创建
              .basicServer(v-if="active===2", :key="2")
                el-alert.gak-text-left(title="最后一步", type="success", description="最后，您只需要设置学生端的端口就完成了。")
                el-form-item(label="端口号")
                  el-input-number.gak-text-left(v-model='port', :step='50')

        el-footer
          el-button-group
            transition(name="el-fade-in", mode="out-in")
              el-button(type="primary", icon="el-icon-arrow-left", v-if="active!==0", @click="prev") 上一步
            transition(name="el-fade-in", mode="out-in")
              el-button(type="primary", icon="el-icon-arrow-right", v-if="active!==2", @click="next") 下一步
              el-button(@click="openServer", type="primary", v-if="active===2") 开启服务

</template>

<script>
import { Loading } from "element-ui";
import { runInNewContext } from "vm";
import { clearInterval } from "timers";
const { verifyNull } = require("@/api/judge");
const { getClassToJobDb, getClassDb, getJobDb } = require("@/api/db");
const { error, success, warning } = require("@/api/message");
const { ipcRenderer, remote } = require("electron");
const path = require("path");
export default {
  data() {
    return {
      active: 0,
      form: {
        className: null,
        jobName: null,
        startTime: null,
        time: null,
        status: 1,
        unfinishedStudents: null
      },
      port: 8888,
      jobJsons: [],
      classJsons: []
    };
  },
  mounted() {
    let _this = this;
    let jobDb = getJobDb();
    //查找数据之后创建
    jobDb.findAllJob().exec((e, jobJsons) => {
      if (e) {
        error(_this, "数据导入出错");
      } else {
        _this.jobJsons = jobJsons;
        let classDb = getClassDb();
        classDb.findAllClass().exec((e, classJsons) => {
          if (e) {
            error(_this, "数据导入出错");
          } else {
            _this.classJsons = classJsons;
          }
        });
      }
    });
  },
  methods: {
    openServer: function(event) {
      let _this = this;
      if (!verifyNull(_this.port)) {
        warning(_this, "端口不能为空");
        return;
      }
      Loading.service({ fullscreen: true });
      let webServer = remote.getGlobal("webServer");
      for (const classJson of _this.classJsons) {
        if (classJson.className == _this.form.className) {
          _this.form.unfinishedStudents = classJson.students;
          break;
        }
      }
      let callBack = function(e, docs) {
        if (e) {
          error(_this, "开启服务错误");
        } else {
          webServer.start(_this.port);
          Loading.service({ fullscreen: true }).close();
          console.log("成功");
        }
      };
      let classToJobDb = getClassToJobDb();
      classToJobDb.insertClassToJob(_this.form, callBack);
    },
    prev: function(event) {
      if (this.active-- < 0) {
        this.active = 0;
      }
    },
    next: function(event) {
      let _this = this;
      if (_this.active == 0) {
        if (!(verifyNull(_this.form.jobName) && verifyNull(_this.form.time))) {
          warning(_this, "数据不能为空");
          return;
        }
      }
      if (_this.active == 1) {
        if (!verifyNull(_this.form.jobName)) {
          warning(_this, "数据不能为空");
          return;
        }
      }
      if (this.active++ > 2) {
        this.active = 2;
      }
    },
    createJob: function() {
      this.$router.push({
        name: "job"
      });
    },
    createClass: function() {
      this.$router.push({
        name: "class"
      });
    }
  }
};
</script>


<style lang="stylus" scoped>
@import '../../styles/server/index.styl';
</style>
