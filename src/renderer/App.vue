<template>
  <div id="app">
    <el-container>
      <el-header>
        <titlebar/>
      </el-header>
      <el-container>
        <!-- <el-aside>
          <sidebar/>
        </el-aside> -->
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
.el-header {
  -webkit-app-region: drag;
  /* background-color: #E4E7ED; */
}
</style>

<script>
import TitleBar from "./components/TitleBar.vue"
import SideBar from "./components/SideBar.vue"
export default {
  components: {
    titlebar: TitleBar,
    sidebar: SideBar
  },
};
</script>
