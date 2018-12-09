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
            #gak-job-content(@click="handleJob(key, job)", align="left") 作业:
              .gak-job-head
                .gak-job-title {{ job.jobName }}
              .gak-job-content.gak-text-hidden  {{ job.jobContent }}
              .gak-job-footer.gak-text-left.gak-text-hidden
                span 类型:
                span(v-for="(type, index) in job.jobTypes", :key="index") &nbsp;{{type}}

</template>


<script>
const { getJobDb } = require("@/api/db");
const { ipcRenderer, remote } = require("electron");
const { error, success, warning } = require("@/api/message");
const { verifyJob } = require("@/api/judge");
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
      oldJob: null,
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
        });
      }
    });
  },
  methods: {
    /**
     * 编辑事件
     *
     * @param key 编辑的数组的元素角标
     * @param job 编辑的元素
     */
    handleEdit: function(key, job) {
      this.form = job;
      this.oldJob = job;
      this.dialogFormVisible = true;
    },
    /**
     * 删除事件
     *
     * @param key 编辑的数组的元素角标
     * @param job 编辑的元素
     */
    handleDelete: function(key, job) {
      let _this = this;
      let callBack = function(e, docs) {
        if (e) {
          error(_this, "删除信息失败");
        } else {
          _this.jobs.splice(key, 1);
          success(_this, "删除信息成功");
        }
      };
      let jobDb = getJobDb();
      jobDb.deleteJob(job.jobName, callBack);
      // _this
      //   .$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //     center: true
      //   })
      //   .then(() => {
      //     let callBack = function(e, docs) {
      //       if (e) {
      //         error(_this, "删除信息失败");
      //       } else {
      //         _this.jobs.splice(this.jobs.indexOf(job), 1);
      //         success(_this, "删除信息成功");
      //       }
      //     };
      //     jobDb.deleteJob(job.jobName, callBack);
      //   })
      //   .catch(() => {});
    },

    /**
     * 保存或更新作业
     */
    handleSubmit: function() {
      let _this = this;
      if (
        verifyJob(
          _this.form.jobName,
          _this.form.jobContent,
          _this.form.jobTypes
        )
      ) {
        if (_this.oldJob == null) {
          // 此时为保存作业，先进行数据封装

          let callBack = function(e, docs) {
            console.log(e);
            if (e) {
              error(_this, "保存信息失败");
            } else {
              _this.jobs.unshift(_this.form);
              success(_this, "保存信息成功");
            }
            _this.oldJob = null;
          };
          let jobDb = getJobDb();
          jobDb.insertJob(_this.form, callBack);
        } else {
          // 此时为更新作业
          let callBack = function(e, docs) {
            if (e) {
              _this.form = _this.oldJob;
              error(_this, "更新信息失败");
            } else {
              success(_this, "更新信息成功");
            }
            _this.oldJob = null;
          };
          let jobDb = getJobDb();
          jobDb.updateJob(_this.oldJob.jobName, _this.form, callBack);
        }
        _this.dialogFormVisible = false;
      } else {
        error(_this, "信息有误,无法保存");
      }
    },
    /**
     * 右侧添加按钮的事件
     */
    handleAdd: function() {
      // 此时为添加
      let _this = this;
      _this.form = {
        jobName: "",
        jobContent: "",
        jobTypes: []
      };
      _this.dialogFormVisible = true;
    },
    handleJob: function (key, job) {
      let _this = this;
      localStorage.setItem("className", job.className);
      _this.$router.push({
        name: "job-class"
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../styles/job/index.styl';
</style>