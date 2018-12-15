<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title Student
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item(:to="{ path: '/class' }") 班级
        el-breadcrumb-item 学生
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
        el-table(:default-sort="{prop: 'id',order: 'ascending'}" :data='tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))', style='width: 100%', height="250", border, v-loading="loading")
          el-table-column(type='index', width='40', align="center")
          el-table-column(label='学号', width="155px", :sortable="true",  :sort-method="sortString" prop="id")
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
const { verifyStudent, verifyStudentUnique } = require("@/api/judge");
const { getClassDb } = require("@/api/db");
const { error, success, warning } = require("@/api/message");
export default {
  data() {
    return {
      className: null,
      studentNum: null,
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
      loading: true
    };
  },
  created() {
    let _this = this;
    _this.className = _this.$route.params.className;
    _this.studentNum = _this.$route.params.studentNum;
  },
  mounted() {
    let _this = this;
    let classDb = getClassDb();
    classDb.findByClassName(_this.className).exec((error, classJsons) => {
      let classJson = classJsons[0];
      let students = classJson.students;
      for (const student of students) {
        _this.tableData.push({
          id: student.id.toString(),
          name: student.name,
          sex: student.sex,
          edit: false
        });
      }
      _this.loading = false;
    });
  },
  beforeRouteLeave(to, from, next) {
    next(false);
    if (this.isEdit) {
      this.$dialog
        .confirm(
          {
            title: "提示",
            body: "还有数据未保存，是否离开?"
          },
          {
            okText: "确认",
            cancelText: "取消"
          }
        )
        .then(dialog => {
          next();
        })
        .catch(() => {});
    } else {
      next();
    }
  },
  methods: {
    // 标题编辑
    sortString(v1, v2){
      return v1.id-v2.id;
    },
    edit(event) {
      let _this = this;
      _this.classNameEdit = true;
      _this.isEdit = true;
      _this.oldClassName = _this.className;
    },
    saveClassName(event) {
      let _this = this;
      let callBack = function(e, docs) {
        if (e) {
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
      let _this = this;
      //判断是否在编辑
      if (!_this.isEdit) {
        row.edit = true;
        _this.$set(_this.tableData, _this.tableData.indexOf(row), row);
        _this.oldStudentId = row.id;
        _this.isEdit = true;
      } else {
        warning(_this, "请先完成您当前的编辑");
      }
    },
    handleDelete(index, row) {
      //删除操作
      let _this = this;
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
          if (_this.oldStudentId != null || !row.edit) {
            let studentId;
            if (!row.edit) {
              studentId = row.id;
            } else {
              studentId = _this.oldStudentId;
            }
            let callBack = function(e, docs) {
              if (e) {
                error(_this, "删除失败，未知错误！");
              } else {
                _this.isEdit = false;
                _this.tableData.splice(_this.tableData.indexOf(row), 1);
                _this.oldStudentId = null;
                success(_this, "删除成功");
              }
              dialog.close();
            };
            let classDb = getClassDb();
            classDb.deleteStudent(_this.className, row.id, callBack);
          } else {
            _this.isEdit = false;
            _this.tableData.splice(_this.tableData.indexOf(row), 1);
            _this.oldStudentId = null;
            success(_this, "删除成功");
            dialog.close();
          }
        })
        .catch(() => {});

      //判断数据是否不可以直接删除
    },
    handleSave(event, index, row) {
      let _this = this;
      if (_this.isEdit) {
        let oldStudents = [..._this.tableData];
        oldStudents.splice(_this.tableData.indexOf(row), 1);
        oldStudents.push(row);
        if (
          !(
            verifyStudent(row.id, row.name, row.sex) &&
            verifyStudentUnique(oldStudents)
          )
        ) {
          warning(_this, "你输入的数据有误,请检查名字是否全为中文且在2-5位.");
          return;
        }
        let callBack = function(e, docs) {
          if (e) {
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
      let _this = this;
      if (!_this.isEdit) {
        _this.tableData.unshift({
          id: "",
          name: "",
          sex: "",
          edit: true
        });
        _this.isEdit = true;
      } else {
        warning(_this, "请先完成您当前的编辑");
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../../styles/class/student/index.styl';
</style>