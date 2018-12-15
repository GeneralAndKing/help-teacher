<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-back(@click="$emit('changeSide')")
      span#gak-main-head-title Call
      el-breadcrumb#gak-main-head-bread(separator='/')
        el-breadcrumb-item(:to="{ path: '/tool' }") 工具
        el-breadcrumb-item 点名
    el-scrollbar#gak-main-call
      #gak-main-call-class.gak-tip-blue
        el-button(type='primary', style="float:right", @click="exportInfo", :disabled="className.trim() === ''") 导出点名信息
        span 请选择您的班级：
        el-select(v-model='classIndex', placeholder='请选择或输入', filterable, @change="changSelect")
          el-option(v-for='(classJson,index) in classJsons', :key='index', :label='classJson.className', :value='index')
        span &nbsp;&nbsp;人数： {{studentNum}}
      #gak-main-call-content
        el-collapse(v-model="activeName", accordion)
          el-collapse-item(name='1')
            template(slot='title')
              i.el-icon-circle-check.gak-icon-right
              | 已到学生
            el-table(:data='students.arriveStudents.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))', style='width: 100%', stripe)
              el-table-column(type='index', width='40', align="center")
              el-table-column(label='学号', prop='id', :sortable="true",  :sort-method="sortString")
              el-table-column(label='姓名', prop='name')
              el-table-column(label='性别', prop='sex', width='80px', sortable)
                template(slot-scope='scope')
                  el-tag(:type="scope.row.sex === '男' ? 'primary' : 'danger'", disable-transitions='') {{scope.row.sex}}
              el-table-column(align="center", width="220")
                template(slot='header', slot-scope='scope')
                  el-input(v-model='search', size='mini', placeholder='输入学号或姓名搜索', clearable)
                template(slot-scope='scope')
                  el-button(size='mini', type='primary', @click='leaveStudent(scope.$index, scope.row)') 请假
                  el-button(size='mini', type='warning', @click='lateStudent(scope.$index, scope.row)') 迟到
                  el-button(size='mini', type='danger', @click='noStudent(scope.$index, scope.row)') 未到
          el-collapse-item(title='请假学生', name='2')
            template(slot='title')
              i.el-icon-question.gak-icon-right
              | 请假学生
            el-table(:data='students.leaveStudents.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))', style='width: 100%', stripe)
              el-table-column(type='index', width='40', align="center")
              el-table-column(label='学号', prop='id', :sortable="true",  :sort-method="sortString")
              el-table-column(label='姓名', prop='name')
              el-table-column(label='性别', prop='sex', width='80px', sortable)
                template(slot-scope='scope')
                  el-tag(:type="scope.row.sex === '男' ? 'primary' : 'danger'", disable-transitions='') {{scope.row.sex}}
              el-table-column(align="center", width="220")
                template(slot='header', slot-scope='scope')
                  el-input(v-model='search', size='mini', placeholder='输入学号或姓名搜索', clearable)
                template(slot-scope='scope')
                  el-button(size='mini', type='success', @click='getStudent(students.leaveStudents, scope.$index, scope.row)') 已到
          el-collapse-item(title='迟到学生', name='３')
            template(slot='title')
              i.el-icon-warning.gak-icon-right
              | 迟到学生
            el-table(:data='students.lateStudents.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))', style='width: 100%', stripe)
              el-table-column(type='index', width='40', align="center")
              el-table-column(label='学号', prop='id', :sortable="true",  :sort-method="sortString")
              el-table-column(label='姓名', prop='name')
              el-table-column(label='性别', prop='sex', width='80px', sortable)
                template(slot-scope='scope')
                  el-tag(:type="scope.row.sex === '男' ? 'primary' : 'danger'", disable-transitions='') {{scope.row.sex}}
              el-table-column(align="center", width="220")
                template(slot='header', slot-scope='scope')
                  el-input(v-model='search', size='mini', placeholder='输入学号或姓名搜索', clearable)
                template(slot-scope='scope')
                  el-button(size='mini', type='success', @click='getStudent(students.lateStudents, scope.$index, scope.row)') 已到
          el-collapse-item(title='未到学生', name='４')
            template(slot='title')
              i.el-icon-circle-close.gak-icon-right
              | 未到学生
            el-table(:default-sort="{prop: 'id',order: 'ascending'}", :data='students.noStudents.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))', style='width: 100%', stripe)
              el-table-column(type='index', width='40', align="center")
              el-table-column(label='学号', prop='id', :sortable="true",  :sort-method="sortString")
              el-table-column(label='姓名', prop='name')
              el-table-column(label='性别', prop='sex', width='80px', sortable)
                template(slot-scope='scope')
                  el-tag(:type="scope.row.sex === '男' ? 'primary' : 'danger'", disable-transitions='') {{scope.row.sex}}
              el-table-column(align="center", width="220")
                template(slot='header', slot-scope='scope')
                  el-input(v-model='search', size='mini', placeholder='输入学号或姓名搜索', clearable)
                template(slot-scope='scope')
                  el-button(size='mini', type='success', @click='getStudent(students.noStudents, scope.$index, scope.row)') 已到
</template>

<script>
  const { writeCallXlsx } = require("@/api/xlsx");
  const {getClassDb} = require("@/api/db");
  const {error, success, warning} = require("@/api/message");
  export default {
    name: "CallAll",
    data() {
      return {
        activeName: '0',
        search: "",
        classJsons: [],
        classIndex: null,
        students: {
          // 已到学生
          arriveStudents: [],
          // 迟到学生
          lateStudents: [],
          // 请假学生
          leaveStudents: [],
          // 未到学生
          noStudents: []
        },
        className: "",
        studentNum: 0
      };
    },
    mounted() {
      let _this = this;
      let classDb = getClassDb();
      classDb.findAllClass().exec((e, classJsons) => {
        if (e) {
          error(_this, "数据错误");
        } else {
          _this.classJsons = classJsons;
        }
      });
    },
    methods: {
      sortString: function (v1, v2) {
        return v1.id - v2.id;
      },
      changSelect: function () {
        let _this = this;
        _this.students.arriveStudents = [];
        _this.students.lateStudents = [];
        _this.students.leaveStudents = [];
        _this.students.noStudents = [];
        _this.students.arriveStudents = _this.classJsons[_this.classIndex].students;
        _this.className = _this.classJsons[_this.classIndex].className;
        _this.studentNum = _this.classJsons[_this.classIndex].students.length;
        _this.activeName = '1';
      },
      leaveStudent: function (key, row) {
        this.students.arriveStudents.splice(this.students.arriveStudents.indexOf(row), 1);
        this.students.leaveStudents.push(row);
      },
      lateStudent: function (key, row) {
        this.students.arriveStudents.splice(this.students.arriveStudents.indexOf(row), 1);
        this.students.lateStudents.push(row);
      },
      noStudent: function (key, row) {
        this.students.arriveStudents.splice(this.students.arriveStudents.indexOf(row), 1);
        this.students.noStudents.push(row);
      },
      getStudent: function (students, key, row) {
        students.splice(students.indexOf(row), 1);
        this.students.arriveStudents.push(row);
      },
      exportInfo: function () {
        let _this = this;
        let callBack = function(e) {
          if (e) {
            error(_this, "导出信息失败");
          } else {
            success(_this, "导出信息成功 可到程序目录callFile查看");
          }
        };
        writeCallXlsx(this.students, this.className, callBack);
      }
    }
  };
</script>

<style scoped lang="stylus">
@import '../../../styles/call/all/index.styl';
</style>