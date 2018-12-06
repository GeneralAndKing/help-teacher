<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Class
    el-scrollbar#gak-main-content-class
      el-collapse(v-model='activeNames', value=2)
        el-collapse-item(title='新增班级', name='1')
          el-upload(class="upload-demo" drag :on-change="fileChange" action="#"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :auto-upload="false")
            i(class="el-icon-upload")
            div(class="el-upload__text") 将文件拖到此处，或
              em 点击提交
            div(class="el-upload__tip" slot="tip") 只能上传excel文件
        el-collapse-item(title='查看班级', name='2')
          el-table(:data='tableData', width="700", border)
            el-table-column(type='index', width='50', align="center")
            el-table-column(label='班级名称', prop='className', width='150', align="center")
            el-table-column(label='班级人数', prop='studentNum', width='150', align="center")
            el-table-column(label='操作', width='250', align="center")
              template(slot-scope='scope')
                el-button(size='mini', type='primary', @click='handleStudent(scope.$index, scope.row)') 管理
                el-button(size='mini', type="warning", @click='handleHomework(scope.$index, scope.row)') 作业
                el-button(size='mini', type='danger', @click='handleDelete(scope.$index, scope.row)') 删除

</template>

<script>
  import {readClassXlsx} from "../../api/xlsx";

  const {ipcRenderer, remote} = require("electron");
  export default {
    data() {
      return {
        activeNames: ['2'],
        tableData: [{
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 25
        }, {
          className: '王小虎',
          studentNum: 77777
        }, {
          className: '王小虎',
          studentNum: 66666
        }, {
          className: '王小虎',
          studentNum: 55555
        }, {
          className: '王小虎',
          studentNum: 4444
        }, {
          className: '王小虎',
          studentNum: 33333
        }, {
          className: '王小虎',
          studentNum: 22222
        }, {
          className: '王小虎',
          studentNum: 11111
        }]
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
      },
      handleStudent(index, row) {
        console.log(index, row);
        // 实现本地存储，使得跳转过去的页面刷新后数据依旧存在
        localStorage.setItem('className',row.className);
        localStorage.setItem('studentNum',row.studentNum);
        this.$router.push({
          name: 'student'
        })
      },
      handleHomework(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  };
</script>
<style lang="stylus" >
  @import '../../styles/class/index';
</style>
