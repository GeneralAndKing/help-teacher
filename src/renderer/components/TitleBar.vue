<template lang="pug">
  el-row#titleBar(type="flex" justify="space-between")
    .left
      i(class="el-icon-sold-out")
      |&nbsp;el-icon-goods
    h5 {{time}}
    .right
      el-button(@click="minWin" type="warning" size="mini" icon="el-icon-minus" circle)
      el-button(@click="maxWin" type="success" size="mini" icon="el-icon-plus" circle)
      el-button(@click="closeWin" type="danger" size="mini" icon="el-icon-close" circle)
</template>


<script>
const { ipcRenderer, remote } = require("electron");
const { getClassToJobDb } = require("@/api/db");
export default {
  data() {
    return {
      time: "2222年2月22日星期2 2:22:22"
    };
  },
  mounted: function() {
    let _this = this;
    let webServer = remote.getGlobal("webServer");
    ipcRenderer.on("closeWebServer", (event, arg) => {
      webServer.stop();
      _this.$dialog.alert("服务结束,正在打包文件");
      //跳转主页
    });
    ipcRenderer.on("compress", message => {
      if (message) {
        _this.$notify({
          title: "打包通知",
          message: "打包文件成功",
          position: "top-left",
          type: "success"
        });
      } else {
        _this.$notify.error({
          title: "打包通知",
          message: "打包文件错误,可到upload下查看",
          position: "top-left"
        });
      }
    });
    let classToJobDb = getClassToJobDb();
    classToJobDb.findByStatus(1).exec((e, classToJobJsons) => {
      if (classToJobJsons.length > 0) {
        classToJobDb.updateStatus(1, 0, (e, docs) => {});
        _this.$notify.error({
          title: "服务异常",
          message: "上次程序运行服务未关闭,已异常暂停",
          position: "top-left"
        });
      }
    });
    setInterval(() => {
      _this.time = new Date().toLocaleString();
    }, 1000);
  },
  methods: {
    closeWin: function() {
      ipcRenderer.send("close");
    },
    minWin: function() {
      ipcRenderer.send("hide-window");
    },
    maxWin: function() {
      ipcRenderer.send("max-window");
    }
  }
};
</script>

<style lang="stylus">
@import '../styles/components/TitleBar.styl';
</style>

