<template lang="pug">
  el-col(:span="18" id="sideBar")
    el-menu(router)
      el-menu-item(index="/")
        i(class="el-icon-menu") 主页
      el-menu-item(index="/example")
        i(class="el-icon-edit") 例子
      el-menu-item(index="/about")
        i(class="el-icon-question") 关于
      el-menu-item(index="/tool")
        i(class="el-icon-question") 工具
</template>

<style lang="stylus">
#sideBar
  height: 100%;
  text-align: left;
</style>

