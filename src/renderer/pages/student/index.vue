<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Student
    #gak-main-content
      #class-info
        el-row(:gutter="10")
          el-col(:span="4")
            span 班级名称
          el-col(:span="10")
            div(v-if='classNameEdit')
              td
                el-input(v-model="className" size="medium")
              td
                el-button(type="warning" size="medium" @click="saveClassName") 保存
            span(@dblclick="edit" v-else) {{ className }}
            
          el-col(:span="5")
            span 班级人数
          el-col(:span="5")
            span {{ studentNum }}
        el-alert(title='Tip:双击班级名称可以编辑哦', type='success', close-text='知道了')
      #student-info
        el-table(:data='tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))', style='width: 100%', height="250" border v-loading="loading")
          el-table-column(type='index', width='40', align="center")
          el-table-column(label='学号', width="155px")
            template(slot-scope='scope')
              el-input(v-if="scope.row.edit", v-model='scope.row.id', clearable, show-overflow-tooltip="true")
              span(v-else) {{ scope.row.id }}
          el-table-column(label='姓名', prop='name', width="130px")
            template(slot-scope='scope')
              el-input(v-if="scope.row.edit", v-model='scope.row.name', clearable)
              span(v-else) {{ scope.row.name }}
          el-table-column(label='性别', prop='sex', width="80px", sortable)
            template(slot-scope='scope')
              el-select(v-if="scope.row.edit", v-model='scope.row.sex', placeholder='请选择')
                el-option(v-for='item in options', :key='item.value', :label='item.value', :value='item.value')
              el-tag(v-else, :type="scope.row.sex === '男' ? 'primary' : 'danger'", disable-transitions='') {{scope.row.sex}}
          el-table-column(align="center")
            template(slot='header', slot-scope='scope')
              el-button(type='primary', icon='el-icon-plus', circle, @click="handleAdd")
              el-input(v-model='search', size='mini', placeholder='输入学号或姓名搜索', style="width:80%;max-width:200px;float:right;", clearable)
            template(slot-scope='scope')
              el-button(size='mini', @click='handleSave($event,scope.$index, scope.row)' v-if='scope.row.edit') 保存
              el-button(size='mini', @click='handleEdit($event,scope.$index, scope.row)' v-if='!scope.row.edit') 编辑
              el-button(size='mini', type='danger', @click='handleDelete(scope.$index, scope.row)' :disabled='isEdit&&!scope.row.edit') 删除

</template>

<script>
const { ipcRenderer, remote } = require("electron");
const { verifyStudent, verifyStudentUnique } = require("../../api/judge");
const { getClassDb } = require("../../api/db");
const { error, success, warning } = require("../../api/message");
export default {
  data() {
    return {
      className: localStorage.className,
      studentNum: localStorage.studentNum,
      // 是否有一行正在编辑的标识符
      isEdit: false,
      classNameEdit: false,
      oldStudentId: null,
      oldClassName: null,
      options: [
        {
          value: "男"
        },
        {
          value: "女"
        }
      ],
      tableData: [],
      search: "",
      loading:true
    };
  },
  mounted() {
    let _this = this;
    let classDb = getClassDb();
    classDb.findByClassName(_this.className).exec((error, classJsons) => {
      let classJson = classJsons[0];
      let students = classJson.students;
      for (const student of students) {
        _this.tableData.push({
          id: student.id,
          name: student.name,
          sex: student.sex,
          edit: false
        });
      }
      _this.loading=false;
    });
  },
  // beforeRouteLeave(to, from, next) {
  //   console.log(to,from,next);
  //   next(false);
  //   if (this.isEdit) {
  //     this.$confirm("还有数据未保存，是否离开", "提示", {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //       center: true
  //     }).then(() => {
  //       next();
  //     });
  //   } else {
  //     next();
  //   }
  // },
  methods: {
    // 标题编辑
    edit(event) {
      let _this = this;
      _this.classNameEdit = true;
      _this.isEdit = true;
      _this.oldClassName = _this.className;
    },
    saveClassName(event) {
      let _this = this;
      let callBack = function(error, docs) {
        if (error) {
          error(_this, "修改错误");
        } else {
          _this.classNameEdit = false;
          _this.isEdit = false;
          _this.oldClassName = null;
          success(_this, "修改成功");
        }
      };
      let classDb = getClassDb();
      classDb.updateClassName(_this.oldClassName, _this.className, callBack);
    },
    handleEdit(event, index, row) {
      //判断是否在编辑
      if (!this.isEdit) {
        row.edit = true;
        this.$set(this.tableData, index, row);
        this.oldStudentId=row.id;
        this.isEdit = true;
      } else {
        warning(_this, "请先完成您当前的编辑");
      }
    },
    handleDelete(index, row) {
      //删除操作
      let _this = this;
      //判断数据是否不可以直接删除
      if (_this.oldStudentId != null || !row.edit) {
        let studentId;
        if (!row.edit) {
          studentId = row.id;
        } else {
          studentId = _this.oldStudentId;
        }
        let callBack = function(error, docs) {
          if (error) {
            error(_this, "删除失败");
          } else {
            _this.isEdit = false;
            _this.tableData.splice(index, 1);
            _this.oldStudentId = null;
            success(_this, "删除成功");
          }
        };
        let classDb = getClassDb();
        classDb.deleteStudent(_this.className, row.id, callBack);
      } else {
        _this.isEdit = false;
        _this.tableData.splice(index, 1);
        _this.oldStudentId = null;
        success(_this, "删除成功");
      }
    },
    handleSave(event, index, row) {
      if (this.isEdit) {
        let oldStudents = [...this.tableData];
        oldStudents.splice(index, 1);
        oldStudents.push(row);
        if (
          !(
            verifyStudent(row.id, row.name, row.sex) &&
            verifyStudentUnique(oldStudents)
          )
        ) {
          warning(_this, "你输入的数据有误");
          return;
        }
        let _this = this;
        let callBack = function(error, docs) {
          if (error) {
            error(_this, "操作错误");
          } else {
            row.edit = false;
            _this.isEdit = false;
            _this.oldStudentId = null;
          }
        };
        let newStudent = {
          id: row.id,
          name: row.name,
          sex: row.sex
        };
        let classDb = getClassDb();

        //更新操作
        if (_this.oldStudentId != null) {
          classDb.updateStudent(
            _this.className,
            _this.oldStudentId,
            newStudent,
            callBack
          );
        }
        //插入操作
        else {
          classDb.insertStudent(_this.className, newStudent, callBack);
        }
      } else {
        warning(_this, "请先完成您当前的编辑");
      }
    },
    handleAdd() {

      if (!this.isEdit) {
        this.tableData.unshift({
          id: "",
          name: "",
          sex: "",
          edit: true
        });
        this.isEdit = true;
      } else {
        warning(_this, "请先完成您当前的编辑");
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../styles/student/index.styl';
</style>