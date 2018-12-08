<template lang="pug">
  el-row#titleBar(type="flex" justify="space-between")
    .left
      i(class="el-icon-share")
      | Help-Teather
    h5 {{time}}
    .right
      el-button(@click="minWin" type="warning" size="mini" icon="el-icon-minus" circle)
      el-button(@click="maxWin" type="success" size="mini" icon="el-icon-plus" circle)
      el-button(@click="closeWin" type="danger" size="mini" icon="el-icon-close" circle)
</template>


<style lang="stylus">
    @import "../styles/components/TitleBar.styl"
</style>

<script>
const { ipcRenderer: ipc } = require("electron");
export default {
  data() {
    return {
      time: "2222年2月22日星期2 2:22:22"
    };
  },
  mounted: function(params) {
    let _this = this;
    setInterval(() => {
      var date = new Date();
      var year = date.getFullYear(); //获取当前年份
      var mon = date.getMonth() + 1; //获取当前月份
      var da = date.getDate(); //获取当前日
      var day = date.getDay(); //获取当前星期几
      var h = date.getHours(); //获取小时
      var m = date.getMinutes(); //获取分钟
      var s = date.getSeconds(); //获取秒
      _this.time =
        year +
        "年" +
        mon +
        "月" +
        da +
        "日" +
        "星期" +
        day +
        " " +
        h +
        ":" +
        m +
        ":" +
        s;
    }, 1000);
  },
  methods: {
    closeWin: function() {
      ipc.send("close");
    },
    minWin: function() {
      ipc.send("hide-window");
    },
    maxWin: function() {
      ipc.send("max-window");
    }
  }
};
</script>

