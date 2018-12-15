<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title Tool
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item 工具
    #gak-main-tools
      template(v-for="(tool, index) in toolList")
        el-col(:span='8')
          el-card.gak-main-tool(:body-style="{ padding: '0px' }", shadow="hover")
            div(@click="routeGoto(tool.route)")
              v-icon.gak-main-tool-icon
                v-icon.gak-main-tool-icon-bg(name='circle', scale='6', v-bind:style="{color:tool.iconBg}")
                v-icon.alert.gak-main-tool-icon-content(:name='tool.iconImg', scale='4')
              .gak-main-tool-name {{ tool.name }}

</template>

<script>
  export default {
    data() {
      return {
        /**
         * name: 显示名字
         * iconBg: 背景颜色
         * iconImg: 显示图标
         * route: 路由地址
         */
        toolList: [
          {
            name: "随机点名",
            iconBg: "#39b0f2",
            iconImg: "hand-paper",
            route: "call"
          },
          {
            name: "班级点名",
            iconBg: "#99CC33",
            iconImg: "users",
            route: "call"
          }
        ]
      };
    },
    methods: {

      /**
       * 工具路由跳转
       *
       * @param path 路径
       */
      routeGoto: function (path) {
        let _this = this;
        _this.$router.push({
          name: path
        });
      }
    }
  };
</script>

<style lang="stylus">
  @import "../../styles/tool/index.styl"
</style>