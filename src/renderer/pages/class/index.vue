<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Class
    el-upload(class="upload-demo" drag :on-change="fileChange" action="#"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :auto-upload="false")
      i(class="el-icon-upload")
        div(class="el-upload__text") 将文件拖到此处，或
          em 点击提交
      div(class="el-upload__tip" slot="tip") 只能上传excel文件
    el-table(:data="tableData" border)
      el-table-column(prop="id" label="学号" width="180" align="center")
      el-table-column(prop="name" label="姓名" width="180" align="center")
      el-table-column(prop="sex" label="性别" width="180" align="center")
</template>

<script>
import { readClassXlsx } from "../../api/xlsx";
const { ipcRenderer, remote } = require("electron");
export default {
  data() {
    return {
      tableData: [
      ]
    };
  },
  methods: {
    fileChange(file, fileList) {
      console.log(this.tableData);
      file.name = "123";
      fileList.pop(-1);
      let results = readClassXlsx(file.raw.path);
      let flag = results[0];
      let classJson = results[1];
      if (flag) {
        this.tableData = classJson.students;
        this.$notify({
          title: "成功",
          message: "导入信息成功",
          type: "success",
          position: 'bottom-right'
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: "导入信息失败",
          position: 'bottom-right'
        });
      }
    }
  }
};
</script>
<style lang="stylus">
@import '../../styles/class/index';
</style>
