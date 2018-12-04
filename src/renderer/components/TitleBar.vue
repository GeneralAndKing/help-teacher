<template lang="pug">
  el-row#titleBar(type="flex" justify="space-between")
    .left
      i(class="el-icon-share")
      | Help-Teather
    h5 {{time}}
    .right
      el-button(@click="minWin" type="warning" size="mini" icon="el-icon-minus" circle)
      el-button(@click="maxWin" type="primary" size="mini" icon="el-icon-plus" circle)
      el-button(@click="closeWin" type="danger" size="mini" icon="el-icon-close" circle)
</template>


<style lang="stylus">
  #titleBar
    height 30px
    background-color rgba(27, 146, 236, 1)
    padding 0 3px 2px
    line-height 30px
    box-shadow 2px 2px 1px #888888
    -webkit-app-region drag
    color success

    h5
      line-height 2.2

    .right
      -webkit-app-region no-drag

      .el-button
        padding 0.25rem
        margin-left 0.4rem
</style>

<script>
  const {ipcRenderer: ipc} = require("electron");
  export default {
    data() {
      return {
        time: 0
      };
    },
    mounted: function (params) {
      let _this = this;
      setInterval(function () {
        const date = new Date();
        const year = date.getFullYear(); //获取当前年份
        const mon = date.getMonth() + 1; //获取当前月份
        const da = date.getDate(); //获取当前日
        const day = date.getDay(); //获取当前星期几
        const h = date.getHours(); //获取小时
        const m = date.getMinutes(); //获取分钟
        const s = date.getSeconds(); //获取秒
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
      closeWin: function () {
        console.log("click close button");
        ipc.send("close");
      },
      minWin: function () {
        console.log("click min button");
        ipc.send("hide-window");
      },
      maxWin: function () {
        console.log("click max button");
        ipc.send("max-window");
      }
    }
  };
</script>

