<template>
<section>
  <h5>Help asdkljaslkdj</h5>
  <div id="titleBar">
      <el-button @click="minWin" type="warning"  size="mini" icon="el-icon-minus" circle></el-button>
      <el-button @click="maxWin" type="primary"  size="mini" icon="el-icon-plus" circle></el-button>
      <el-button @click="closeWin" type="danger"  size="mini" icon="el-icon-close" circle></el-button>
    </div>
</section >
</template>


<style>
section{
  width: 100%;
}
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

