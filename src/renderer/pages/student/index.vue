<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title Student
    #gak-main-content
      #class-info
        el-row(:gutter="10")
          el-col(:span="4")
            span 班级名称
          el-col(:span="10")
            span(@dblclick="edit") {{ className }}
          el-col(:span="5")
            span 班级人数
          el-col(:span="5")
            span {{ studentNum }}
        el-alert(title='双击班级名称可以编辑哦', type='info', close-text='知道了')
      #student-info
        el-table(:data='tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.id.includes(search))', style='width: 100%', height="250")
          el-table-column(type='index', width='40', align="center")
          el-table-column(label='学号', width="160px")
            template(slot-scope='scope')
              el-input(v-if="scope.row.edit", v-model='scope.row.id', clearable, show-overflow-tooltip="true")
              span(v-else) {{ scope.row.id }}
          el-table-column(label='姓名', prop='name', width="120px")
            template(slot-scope='scope')
              el-input(v-if="scope.row.edit", v-model='scope.row.name', clearable)
              span(v-else) {{ scope.row.name }}
          el-table-column(label='性别', prop='sex', width="85px", sortable)
            template(slot-scope='scope')
              //-
                滑动方式选择，因影响排版无法使用
                el-switch(v-if="scope.row.edit", style='display: block', v-model='scope.row.sex', active-color='#13ce66', inactive-color='#ff4949',
                active-text='男', inactive-text='女',active-value='男',inactive-value="女")
              el-select(v-if="scope.row.edit", v-model='scope.row.sex', placeholder='请选择')
                el-option(v-for='item in options', :key='item.value', :label='item.value', :value='item.value')
              el-tag(v-else, :type="scope.row.sex === '男' ? 'primary' : 'danger'", disable-transitions='') {{scope.row.sex}}
          el-table-column(align="center")
            template(slot='header', slot-scope='scope')
              el-input(v-model='search', size='mini', placeholder='输入学号或姓名搜索', style="width:80%")
              el-button(type='primary', icon='el-icon-plus', circle, @click="hanldeSave")
            template(slot-scope='scope')
              el-button(size='mini', @click='handleEdit($event,scope.$index, scope.row)') 编辑
              el-button(size='mini', type='danger', @click='handleDelete(scope.$index, scope.row)') 删除

</template>
<style lang="stylus" scoped>
  @import "../../styles/student/index.styl"
</style>

<script>
  import {Notification} from 'element-ui';

  export default {
    data() {
      return {
        className: localStorage.className,
        studentNum: localStorage.studentNum,
        options: [{
          value: '男'
        }, {
          value: '女'
        }],
        tableData: [{
          id: '201607090211231231231232',
          name: '王啊啊虎',
          sex: '男',
          edit: false
        }, {
          id: '201607090234',
          name: '王2虎',
          sex: '男',
          edit: false
        }, {
          id: '201607090265',
          name: '王3虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090218',
          name: '王4虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090234',
          name: '王2虎',
          sex: '男',
          edit: false
        }, {
          id: '201607090265',
          name: '王3虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090218',
          name: '王4虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090234',
          name: '王2虎',
          sex: '男',
          edit: false
        }, {
          id: '201607090265',
          name: '王3虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090218',
          name: '王4虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090234',
          name: '王2虎',
          sex: '男',
          edit: false
        }, {
          id: '201607090265',
          name: '王3虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090218',
          name: '王4虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090234',
          name: '王2虎',
          sex: '男',
          edit: false
        }, {
          id: '201607090265',
          name: '王3虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090218',
          name: '王4虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090234',
          name: '王2虎',
          sex: '男',
          edit: false
        }, {
          id: '201607090265',
          name: '王3虎',
          sex: '女',
          edit: false
        }, {
          id: '201607090218',
          name: '王4虎',
          sex: '女',
          edit: false
        }],
        search: ''
      };
    },
    methods: {
      edit(event) {
        const target = event.target;
        const oldHtml = target.innerHTML;
        const newDiv = document.createElement('div');
        newDiv.classList.add("el-input");
        const newInput = document.createElement('input');
        newInput.type = "text";
        newInput.value = oldHtml;
        newInput.classList.add("el-input__inner");
        newDiv.appendChild(newInput);
        let parentNode = target.parentNode;
        parentNode.appendChild(newInput);
        parentNode.removeChild(target);
        newInput.focus();
        // 监听焦点移出事件
        newInput.onblur = function () {
          // 判断是否改变
          if (this.value === oldHtml) {
            target.innerHTML = oldHtml;
          } else {
            target.innerHTML = this.value;
            localStorage.className = target.innerHTML;
            Notification.success({
              title: '成功',
              message: '您已成功修改班级名称',
              type: 'success',
              duration: 2000,
              offset: 100
            });
          }
          let newParent = this.parentNode;
          newParent.removeChild(this);
          newParent.appendChild(target);
          // 更新缓存
        };
      },
      handleEdit(event, index, row) {
        if (row.edit) {
          // 编辑的保存事件
          Notification.success({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000,
            offset: 100
          });
        }
        if (row.new){
          // 添加数据保存事件
          row.new = false;
        }
        row.edit = !row.edit;
        if (row.edit) {
          event.target.innerHTML = "保存";
        } else {
          event.target.innerHTML = "编辑";
        }
      },
      handleDelete(index, row) {
        // 删除事件
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.tableData.splice(index,1);
          this.$message({
            type: 'success',
            message: '删除成功!',
            showClose: true
          });
        });
      },
      hanldeSave(event) {
        this.tableData.unshift({
          id: '',
          name: '',
          sex: '男',
          edit: true,
          new: true
        });
      }
    }
  };
</script>