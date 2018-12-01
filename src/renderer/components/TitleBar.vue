<template>
  <div id="titleBar">
    <el-button type="warning" size="small" @click="minWin"  icon="el-icon-minus" circle></el-button>
    <el-button type="success" size="small" @click="maxWin"  icon="el-icon-plus" circle></el-button>
    <el-button type="danger"  size="small" @click="closeWin" icon="el-icon-close" circle></el-button>
  </div>
</template>


<style>
#titleBar {
  float: right;
  -webkit-app-region: no-drag;
}
</style>

<script>
const { ipcRenderer: ipc } = require("electron");
export default {
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

