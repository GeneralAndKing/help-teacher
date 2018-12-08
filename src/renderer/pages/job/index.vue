<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title homework
    el-scrollbar#gak-main-content-job
      el-dialog(title='作业', :visible.sync='dialogFormVisible', top="20px", @close="dialogClose")
        el-form(:model='form')
          el-form-item(label='作业名称')
            el-input(v-model='form.jobName', autocomplete='off', clearable)
          el-form-item(label='作业描述')
            el-input( type="textarea", autosize, v-model='form.jobContent', autocomplete='off', clearable)
          el-form-item(label='文档限制')
            br/
            el-select.gak-text-left(v-model='form.select', multiple, filterable, allow-create, default-first-option, placeholder='请选择或输入类型', style="width: 100%;")
              el-option(v-for='(select, index) in types', :key="index", :label='select.name', :value='select.name')
        .dialog-footer(slot='footer')
          el-button(@click='dialogFormVisible = false') 取 消
          el-button(type='primary', @click='handleSubmit') 确 定

      el-dropdown#gak-main-content-menu(trigger='click')
        span.el-dropdown-link
          i.el-icon-caret-bottom.el-icon--right
        el-dropdown-menu(slot='dropdown')
          el-dropdown-item
            //- 增加
            el-button(type='primary', icon='el-icon-plus', circle, @click="handleAdd")

      template(v-for='(job, key) in jobs')
        el-col(:span='8')
          el-card.gak-job(shadow="hover")
            .gak-job-do
              el-button(type='primary', icon='el-icon-edit', @click="handleEdit(key, job)", circle, size="mini")
              el-button(type='danger', icon='el-icon-close', @click="handleDelete(key, job)", circle,  size="mini")
            .gak-job-head 作业:
              .gak-job-title {{ job.jobName }}
            .gak-job-content  {{ job.jobContent }}
            .gak-job-fovalueot.gak-text-left 作业类型:
              span(v-for="(type, index) in job.jobTypes", :key="index") &nbsp;{{type.type}}

</template>
<style lang="stylus" scoped>
  @import "../../styles/job/index.styl"
</style>

<script>
const { getJobDb } = require("../../api/db");
  const {ipcRenderer, remote} = require("electron");
  export default {
    data() {
      return {
        dialogFormVisible: false,
        types: [{
          name: "word"
        }, {
          name: "excel"
        }, {
          name: "ppt"
        }, {
          name: "rar"
        }, {
          name: "zip"
        }],
        form: {
          jobName: "",
          jobContent: "",
          jobTypes: [],
          select:[]
        },
        // 用这个参数来判断是新增还是编辑
        new: false,
        index: 0,
        jobs: []
      };
    },
    mounted() {
      //保持环境
      let _this = this;
      let jobDb=getJobDb();
      jobDb.findAllJob().exec((error, jobs) => {
        for (const job of jobs) {
          _this.jobs.push({
            jobName: job.jobName,
            jobContent: job.jobContent,
            jobTypes: job.jobTypes
          })
        }
      })
    },
    methods: {
      /**
       * 编辑事件
       *
       * @param key 编辑的数组的元素角标
       * @param job 编辑的元素
       */
      handleEdit: function (key, job) {
        this.form = job;
        this.dialogFormVisible = true;
        // 此时为编辑
        this.new = true;
        this.index = key;
      },
      /**
       * 删除事件
       *
       * @param key 编辑的数组的元素角标
       * @param job 编辑的元素
       */
      handleDelete: function (key, job) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.jobs.splice(this.jobs.indexOf(job), 1);
          let JobDb = remote.getGlobal("JobDb");
          let jobDb = new JobDb();
          // this.jobs.splice(this.jobs[key],1);
          console.log(this.jobs[key].jobName);
          jobDb.deleteJob(this.jobs[key].jobName);
          this.$message({
            type: 'success',
            message: '删除成功!',
            showClose: true
          });
        }).catch(() => {
        });
      },
      /**
       * 关闭对话框时
       */
      dialogClose: function () {
        this.new = false;
        this.index = 0;
      },
      /**
       * 保存或更新作业
       */
      handleSubmit: function () {
        // 数据封装
        this.form.jobTypes = [];
        this.form.select.forEach(ele => {
          this.form.jobTypes.push({
            type: ele,
            state: ele + "格式的作业"
          })
        });
        if (this.new) {
          // 此时为更新作业
          this.jobs[this.index] = this.form;
          this.$notify({
            title: "成功",
            message: "更新信息成功",
            type: "success",
            position: 'bottom-right'
          });
        } else {
          // 此时为保存作业，先进行数据封装
          this.jobs.unshift(this.form);
          this.$notify({
            title: "成功",
            message: "更新信息成功",
            type: "success",
            position: 'bottom-right'
          });
        }
        this.dialogFormVisible = false;
      },
      handleAdd: function () {
        this.form = {
          jobName: "",
          jobContent: "",
          jobTypes: []
        };
        this.dialogFormVisible = true;
      }
    }
  };
</script>