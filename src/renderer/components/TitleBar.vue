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
export default {
  data() {
    return {
      time: "2222年2月22日星期2 2:22:22"
    };
  },
  mounted: function() {
    let _this = this;
    ipcRenderer.on("closeWebServer", (event, arg) => {
      let webServer = remote.getGlobal("webServer");
      webServer.stop();
      _this.$alert(
        "收取服务已结束,可到对应的作业管理查看收取详情(打包作业正在进行中)",
        "提示",
        {
          confirmButtonText: "跳转到主页",
          callback: action => {
            _this.$router.push({
              name: "home"
            });
          }
        }
      );
      //跳转主页
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

