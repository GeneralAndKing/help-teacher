<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title 班级管理
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
const { readClassXlsx } = require("@/api/xlsx");
const { verifyStudentUnique } = require("@/api/judge");
const { getClassDb } = require("@/api/db");
const { error, success, warning } = require("@/api/message");
const { ipcRenderer, remote } = require("electron");
const { MessageBox } = require("element-ui");
export default {
  data() {
    return {
      activeNames: ["2"],
      tableData: []
    };
  },
  mounted() {
    let _this = this;
    let classDb = getClassDb();
    classDb.findAllClass().exec((error, classJsons) => {
      for (const classJson of classJsons) {
        _this.tableData.push({
          className: classJson.className,
          studentNum: classJson.students.length
        });
      }
    });
  },
  methods: {
    fileChange(file, fileList) {
      let _this = this;
      fileList.pop(-1);
      let results = readClassXlsx(file.raw.path);
      let flag = results[0];
      let classJson = results[1];
      if (flag && verifyStudentUnique(classJson.students)) {
        MessageBox.prompt("请输入班级名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputErrorMessage: "输入不能为空"
        })
          .then(({ value }) => {
            classJson.className = value;
            let classDb = getClassDb();
            let callBack = function(e, docs) {
              if (e) {
                error(_this, "导入数据失败");
              } else {
                // 这里才算真的导入成功
                success(_this, "导入信息成功");
                // 保存后跳转到学生界面
                _this.$router.push({
                  name: "student",
                  params: {
                    className: classJson.className,
                    studentNum: classJson.students.length
                  }
                });
              }
            };
            classDb.insertClass(classJson, callBack);
          })
          .catch(() => {
            error(_this, "您取消了保存");
          });
      } else {
        error(_this, "导入数据失败");
      }
    },
    handleStudent(index, row) {
      let _this = this;
      _this.$router.push({
        name: "student",
        params: {
          className: row.className,
          studentNum: row.studentNum
        }
      });
    },
    handleHomework(index, row) {
      let _this = this;
      _this.$router.push({
        name: "class-job",
        params: {
          className: row.className
        }
      });
    },
    handleDelete(index, row) {
      let _this = this;
      let classDb = getClassDb();
      _this.$dialog
        .confirm(
          {
            title: "提示",
            body: "删除后不可恢复，确认删除此数据吗？"
          },
          {
            loader: true,
            okText: "确认",
            cancelText: "取消"
          }
        )
        .then(dialog => {
          let callBack = function(e, docs) {
            if (e) {
              error(_this, "删除失败");
            } else {
              _this.tableData.splice(index, 1);
              success(_this, "删除成功");
            }
            dialog.close();
          };
          classDb.deleteClass(row.className, callBack);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="stylus">
@import '../../styles/class/index';
</style>
