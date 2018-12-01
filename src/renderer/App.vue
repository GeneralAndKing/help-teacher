<template>
  <div id="app">
    <el-container>
      <el-header class="header" height="30px">
        <titlebar/>
      </el-header>
      <el-container>
        <el-aside>
          <sidebar/>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
/* #app {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  text-align: center;
} */
.header {
  -webkit-app-region: drag;
  background-color: rgb(158, 5, 5);
  padding: 0px;
  padding-right: 3px;
  padding-bottom: 2px;
}
* {
  padding: 0px;
  margin: 0px;
}
</style>

<script>
import TitleBar from "./components/TitleBar.vue";
import SideBar from "./components/SideBar.vue";
export default {
  components: {
    titlebar: TitleBar,
    sidebar: SideBar
  }
};
</script>
