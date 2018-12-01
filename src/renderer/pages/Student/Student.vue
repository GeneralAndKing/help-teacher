<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      :on-change="fileChange"
      action="#"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :auto-upload="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <em>请点击选择文件</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
    </el-upload>

    <el-table
      :data="tableData">
      <el-table-column
        prop="id"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="class"
        label="班级">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    data:{

    },
    methods:{
        fileChange(file,fileList){
            console.log(file,fileList)
        }
    }
}
</script>

