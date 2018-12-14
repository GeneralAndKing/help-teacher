<template lang="pug">
  #app
    title-bar
    el-container#gak-container
      el-aside(v-bind:class="{'el-aside-hide': aside }" style="width:150px")
        side-bar
      el-container
        transition(name="el-zoom-in-center", mode="out-in")
          router-view(@changeSide="aside=!aside")
</template>



<script>
document.addEventListener("drag",()=>{
  event.preventDefault();
},false);
document.addEventListener("dragstart",()=>{
  event.preventDefault();
},false);
document.addEventListener("dragend",()=>{
  event.preventDefault();
},false);
document.addEventListener("dragover",()=>{
  event.preventDefault();
},false);
document.addEventListener("dragenter",()=>{
  event.preventDefault();
},false);
document.addEventListener("dragleave",()=>{
  event.preventDefault();
},false);
document.addEventListener("drop",()=>{
  event.preventDefault();
},false);
import TitleBar from "./components/TitleBar.vue";
import SideBar from "./components/SideBar.vue";

export default {
  data() {
    return {
      aside: false
    };
  },
  components: {
    "side-bar": SideBar,
    "title-bar": TitleBar
  }
};
</script>

<style lang="stylus" >
@import 'styles/app';
</style>
