<template lang="pug">
  el-container(class='container')
    el-header(class='header')
      #el-header-title Help-Teacher
    el-container
      el-main(class='main', style="max-width:800px;")
        .gak-tip-blue
          #gak-main-name 作业收取
          #gak-main-title 作业标题：{{jobName}}
          #gak-main-content 作业详情：{{jobContent}}
          #gak-main-time 剩余时间：
            countdown(:time='time', :transform="transform", :auto-start="false", ref="countdown")
              template(slot-scope='props') {{ props.hours }} : {{ props.minutes }} : {{ props.seconds }}
        el-form(:model='form', ref="form", :rules='rules')
          el-form-item(label='学号', prop='StudentId', :rules="[\
            { required: true, message: '学号不能为空'}\
          ]")
            el-input(type="text", v-model='form.StudentId', autocomplete='off', clearable, placeholder="请输入学号")
          el-form-item(label='作业文件',  prop='input')
            el-upload.upload-demo(ref='upload', action='/upload', :on-preview='handlePreview', :on-success="submitForm",
            :on-error="handleError", :on-exceed="handleExceed", :on-change='handleChange',
            :on-remove='handleRemove', :file-list='fileList', :auto-upload='false', :limit=1, :before-upload="beforeAvatarUpload")
              el-button(slot='trigger', size='small', type='primary') 选取文件
              .el-upload__tip(slot='tip') 只能上传格式为{{ fileTypes }}的文件。
          el-form-item(style="text-align:center;")
            el-button(type='primary', @click='onSubmit(\'form\')') 提交作业
            el-button(@click="resetForm(\'form\')") 重置
        #app(width='100%')
          #gak-main-chart(style='width: 100%;height:400px;')
    el-footer
      hr#gak-main-about-hr
      p#gak-main-about-content 非常感谢您使用我们的这款小而不太精致的软件，如有问题请随时反馈到github，传送门在下面。如果您觉得不错，欢迎 star，如果您是开发者，欢迎 fork 和 pull request。
      img#gak-main-about-github(src="../../assets/github.png", @click="goGithub")
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        fileList: [],
        form: {
          StudentId: ''
        },
        charts :null,
        time: 10000,
        fileCount: 0,
        fileUpload: false,
        jobName: '',
        jobContent: '',
        leaveTime: '',
        fileTypes: "",
        data: [{value: 0, name: "未交人数"}, {value: 0, name: "已交人数"}],
        option: {
          title: {
            text: "",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: ["已交人数", "未交人数"]
          },
          color: ["#F66", "#9CF"],
          series: [
            {
              name: "作业情况",
              type: "pie",
              radius: "80%",
              center: ["50%", "55%"],
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        }
      }
    },
    methods: {
      onSubmit(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = _this.$refs['form'].$el;
            if (_this.fileCount != 1 || _this.fileUpload) {
              if (_this.fileUpload) {
                _this.$message.warning('已经上传过了，重新选择文件再次尝试上传！！');
              } else {
                _this.$message.warning('必须选择一个文件才能提交！');
              }
            } else {
              //执行表单提交以及文件上传
              _this.$refs.upload.submit();
            }
          } else {
            _this.$message.warning('作业无法提交请检查输入是否完整！');
            _this.fileUpload = false;
            return false;
          }
        });
      },
      handleRemove(file, fileList) {
        this.fileCount = 0;
      },
      handlePreview(file) {
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleChange(file, fileList) {
        if (file) {
          this.fileCount = 1;
        }
        this.fileUpload = false;
      },
      submitForm(response, file, fileList) {
        let _this = this;
        //文件上传成功以后提交表单
        let formData = new FormData();
        let filename = file.response.data.name;
        //文件扩展名
        let arr = filename.split('.');
        let type = arr[arr.length - 1];
        let fileTempPath = file.response.data.path;
        //封装数据
        formData.append('fileType', type);
        formData.append('fileTempPath', fileTempPath);
        formData.append('StudentId', this.form.StudentId + "");
        this.$http.post('/submitHomework', formData)
          .then(response => {
            if (response.status == 200) {
              if (response.data.status == 1) {
                _this.$message.success('作业提交成功，重复提交相同文件会覆盖上一次提交的文件！');
                _this.fileUpload = true;
                _this.reload();
                _this.getInfo();
                _this.form.StudentId = "";
                _this.$refs.upload.clearFiles();
              } else {
                _this.fileUpload = false;
                _this.$message.error('作业提交失败,' + response.data.error + '！');
                _this.$refs.upload.clearFiles();
              }
            }
          })
          .catch(function (error) {
            this.fileUpload = false;
            this.$message.error('错了哦，无法访问接口！');
          });
      },
      goGithub: function () {
        window.open("https://github.com/GeneralAndKing/help-teacher");
      },
      handleError(err, file, fileList) {
        this.fileCount = 0;
        this.fileUpload = false;
        this.$message.error('错了哦，无法上传文件！');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleCurrentChange(cpage) {
        this.currpage = cpage;
      },
      handleSizeChange(psize) {
        this.pagesize = psize;
      },
      getInfo() {
        let _this = this;
        // 获取未交学生列表
        this.$http.get('/getJobInformation')
          .then(response => {
            if (response.status == 200) {
              if (response.data) {
                _this.jobName = response.data.data.jobName;
                _this.jobContent = response.data.data.jobContent;
                _this.time = response.data.data.time;
                _this.data[0].value = response.data.data.unfinishedStudentNum;
                _this.data[1].value = response.data.data.studentNum - response.data.data.unfinishedStudentNum;
                _this.$refs.countdown.start()
                let types = response.data.data.jobTypes.split(",");
                let typeList = [];
                //遍历文件列表 限制文件类型
                for (const type of types) {
                  if (type == '.excel') {
                    typeList.push(".xlsx");
                    typeList.push(".xls");
                  } else if (type == '.word') {
                    typeList.push(".doc");
                    typeList.push(".docx");
                  } else if (type == '.ppt') {
                    typeList.push(".ppt");
                    typeList.push(".pptx");
                  } else {
                    typeList.push(type);
                  }
                }
                _this.fileTypes = typeList.join(",");
                _this.option.series[0].data = _this.data;
                _this.charts.setOption(_this.option);
              }
            }
          })
          .catch(error => {
          });
      },
      beforeAvatarUpload: function (file) {
        let _this = this;
        let type = file.name.substring(file.name.lastIndexOf('.') + 1);
        let res = _this.fileTypes.indexOf(type) > 0;
        if (!res){
          this.$message.error('上传文件格式不合法，只能为' + _this.fileTypes + '格式。');
        }
        return res;
      },
      transform: function (props) {
        Object.entries(props).forEach(([key, value]) => {
          const digits = value < 10 ? `0${value}` : value;
          props[key] = `${digits} `;
        });
        return props;
      }
    },
    created() {
      // let _this = this;
      // _this.classToJob = _this.$route.params.classToJob;
      // _this.data[0].value = _this.classToJob.unfinishedStudents.length;
      // _this.data[1].value = _this.classToJob.studentNum - _this.data[0].value;
    },
    mounted() {
      this.getInfo();
      let _this = this;
      let myChart = _this.$echarts.init(
        document.getElementById("gak-main-chart")
      );
      //设置图表option
      _this.option.series[0].data = _this.data;
      myChart.setOption(_this.option);
      _this.charts = myChart;
    }
  }

</script>

<style lang="stylus">
  @import '../../styles/home/index.styl';
</style>