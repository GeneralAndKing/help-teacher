<template lang="pug">
  #app
    title-bar
    el-container#gak-container
      el-aside(v-bind:class="{'el-aside-hide': aside }" style="width:150px")
        side-bar
      el-container
        transition(name="el-zoom-in-center" mode="out-in")
          router-view(@changeSide="aside=!aside")
</template>

<style lang="stylus" >
  @import "styles/app"
</style>

<script>
  import TitleBar from "./components/TitleBar.vue";
  import SideBar from "./components/SideBar.vue";

  export default {
    data() {
      return {
        aside: false
      }
    },
    components: {
      "side-bar": SideBar,
      "title-bar": TitleBar
    }
  };
</script>
