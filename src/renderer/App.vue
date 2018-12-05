<template lang="pug">
  #app
    title-bar
    el-container#gak-container
      el-aside
        side-bar
      el-container
        transition(name="el-zoom-in-center" mode="out-in")
          router-view
</template>

<style lang="stylus">
  @import "styles/app"

</style>

<script>
  import TitleBar from "./components/TitleBar.vue";
  import SideBar from "./components/SideBar.vue";

  export default {
    components: {
      "side-bar": SideBar,
      "title-bar": TitleBar
    }
  };
</script>
