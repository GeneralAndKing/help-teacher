<template lang="pug">
  el-row(type="flex" justify="space-between")
    el-col(class="left" :span="6")
      i(class="el-icon-share") Help-Teather
    el-col(:span="6")
      h5 {{time}}
    el-col(class="right" :span="6")
      el-button(@click="minWin" type="warning" size="mini" icon="el-icon-minus" circle)
      el-button(@click="maxWin" type="primary" size="mini" icon="el-icon-plus" circle)
      el-button(@click="closeWin" type="danger" size="mini" icon="el-icon-close" circle)
</template>


<style lang="stylus">
section
  width 100%

#titleBar
  float right
  -webkit-app-region no-drag

.right
  -webkit-app-region no-drag

</style>

<script>
const { ipcRenderer: ipc } = require("electron");
export default {
  data() {
    return {
      time: 0
    };
  },
  mounted: function(params) {
    let _this = this;
    setInterval(function() {
      var date = new Date();
      var year = date.getFullYear(); //获取当前年份
      var mon = date.getMonth() + 1; //获取当前月份
      var da = date.getDate(); //获取当前日
      var day = date.getDay(); //获取当前星期几
      var h = date.getHours(); //获取小时
      var m = date.getMinutes(); //获取分钟
      var s = date.getSeconds(); //获取秒
      _this.time =
        "当前时间:" +
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
      console.log("click close button");
      ipc.send("close");
    },
    minWin: function() {
      console.log("click min button");
      ipc.send("hide-window");
    },
    maxWin: function() {
      console.log("click max button");
      ipc.send("max-window");
    }
  }
};
</script>

