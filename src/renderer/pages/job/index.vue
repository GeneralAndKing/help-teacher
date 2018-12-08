<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title homework
    el-scrollbar#gak-main-content-job
      el-dialog(title='作业', :visible.sync='dialogFormVisible', top="20px")
        el-form(:model='form')
          el-form-item(label='作业名称')
            el-input(v-model='form.jobName', autocomplete='off', clearable)
          el-form-item(label='作业描述')
            el-input( type="textarea", autosize, v-model='form.jobContent', autocomplete='off', clearable)
          el-form-item(label='文档限制')
            br/
            el-select.gak-text-left(v-model='form.jobTypes', multiple, filterable, allow-create, default-first-option, placeholder='请选择或输入类型', style="width: 100%;")
              el-option(v-for='(select, index) in types', :key="index", :label='select', :value='select')
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
              span(v-for="(type, index) in job.jobTypes", :key="index") &nbsp;{{type}}

</template>
<style lang="stylus" scoped>
  @import "../../styles/job/index.styl"
</style>

<script>
  const {getJobDb} = require("../../api/db");
  const {ipcRenderer, remote} = require("electron");
  const {error, success, warning} = require("../../api/message");
  export default {
    data() {
      return {
        dialogFormVisible: false,
        types: ["word", "excel", "ppt", "rar", "zip"],
        form: {
          jobName: "",
          jobContent: "",
          jobTypes: []
        },
        // 用这个参数来判断是新增还是编辑
        new: false,
        jobs: []
      };
    },
    mounted() {
      //保持环境
      let _this = this;
      let jobDb = getJobDb();
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
        this.new = false;
      },
      /**
       * 删除事件
       *
       * @param key 编辑的数组的元素角标
       * @param job 编辑的元素
       */
      handleDelete: function (key, job) {
        let _this = this;
        _this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          _this.jobs.splice(this.jobs.indexOf(job), 1);
          let JobDb = remote.getGlobal("JobDb");
          let jobDb = new JobDb();
          jobDb.deleteJob(_this.jobs[key].jobName);
          success(_this, "删除成功");
        }).catch(() => {
        });
      },

      /**
       * 保存或更新作业
       */
      handleSubmit: function () {
        let _this = this;
        if (_this.new) {
          // 此时为保存作业，先进行数据封装
          _this.jobs.unshift(_this.form);
          success(_this, "保存信息成功");
        } else {
          // 此时为更新作业
          // _this.jobs[_this.index] = _this.form;
          success(_this, "更新信息成功");
        }
        _this.dialogFormVisible = false;
      },
      /**
       * 右侧添加按钮的事件
       */
      handleAdd: function () {
        // 此时为添加
        let _this = this;
        _this.new = true;
        _this.form = {
          jobName: "",
          jobContent: "",
          jobTypes: []
        };
        _this.dialogFormVisible = true;
      }
    }
  };
</script>