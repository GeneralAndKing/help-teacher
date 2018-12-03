<template lang="pug">
  div
    el-upload(class="upload-demo" drag :on-change="fileChange" action="#"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :auto-upload="false")
      i(class="el-icon-upload")
        div(class="el-upload__text") 将文件拖到此处，或
          em 点击提交
      div(class="el-upload__tip" slot="tip") 只能上传excel文件
    el-table(:data="tableData")
      el-table-column(prop="id" label="学号" width="180")
      el-table-column(prop="name" label="姓名" width="180")
      el-table-column(prop="class" label="班级")
</template>

<script>
import { readClassXlsx } from "../../api/xlsx";
const { ipcRenderer, remote } = require("electron");
export default {
  data: {},
  methods: {
    fileChange(file, fileList) {
      file.name = "123";
      fileList.pop(-1);
      console.log(readClassXlsx(file.raw.path));
    }
  }
};
</script>

