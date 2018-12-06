<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Server
    el-container
      el-header
        el-steps(:active="active" align-center)
          el-step(title="欢迎使用")
          el-step(title="作业资料" description="设置收取作业的资料信息")
          el-step(title="设置服务" description="设置Web服务的一系列信息")
          el-step(title="开启服务")
      el-main(class="basic")
        el-form(:model="server" label-width="80px" label-position="left")
          div(class="basicIndex" v-if="active===0")
          div(class="basicData" v-if="active===1")
            el-form-item(label="作业名称")
              el-input(v-model="server.title" placeholder="请输入作业名称")
            el-form-item(label="时间(分钟)")
              el-slider(v-model="server.time" show-input :min="10" :max="60" label="提交时间")
            el-upload(drag action="https://jsonplaceholder.typicode.com/posts/")
              i(class="el-icon-upload")
              div(class="el-upload__text") 将execl拖到此处，或
                em 点击提交
              div(class="el-upload__tip" slot="tip") 只能提交execl文件
          div(class="basicConfig" v-if="active===2")
          div(class="basicServer" v-if="active===3")
            el-button(@click="openServer" type="primary") 开启服务
      el-footer
        el-button-group
          el-button(type="primary" icon="el-icon-arrow-left" v-if="active!=0" @click="prev") 上一步
          el-button(type="primary" icon="el-icon-arrow-right" v-if="active!=3" @click="next") 下一步

</template>
<style lang="stylus" scoped>
  @import "../../styles/server/index"

</style>


<script>
import { Loading } from "element-ui";
import { runInNewContext } from "vm";
import { clearInterval } from 'timers';
const { ipcRenderer } = require("electron");
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
        time: ""
      }
    };
  },
  methods: {
    openServer: function(event) {
      Loading.service({ fullscreen: true });
      var webServer = remote.getGlobal("webServer");
      webServer.start(3000);
      Loading.service({ fullscreen: true }).close();
    },
    prev: function(event) {
      if (this.active-- < 0) {
        this.active = 0;
      }
    },
    next: function(event) {
      if (this.active++ > 3) {
        this.active = 0;
      }
    }
  }
};
</script>
