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
const { ipcRenderer: ipc } = require("electron");
export default {
  data() {
    return {
      time: "2222年2月22日星期2 2:22:22"
    };
  },
  mounted: function() {
    let _this = this;
    setInterval(() => {
      _this.time =new Date().toLocaleString();
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

<style lang="stylus">
@import '../styles/components/TitleBar.styl';
</style>

