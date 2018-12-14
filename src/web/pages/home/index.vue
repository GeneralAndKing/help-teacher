<template lang="pug">
    el-container(class='container')
        el-header(class='header') Help-Teacher
        el-container
            el-aside(width='50%')
                #app(width='100%')
                    #gak-main-chart(style='width: 600px;height:400px;')

            el-main(class='main',width='50%') 交作业
                #title 作业标题:{{jobName}}
                #content 作业详情:{{jobContent}}
                el-form(ref='form', :model='form', label-width='200px')
                    el-form-item(label='学号',prop='StudentId',:rules="[\
          { required: true, message: '学号不能为空'},\
          { type: 'number', message: '学号必须为数字值'}\
          ]")
                        el-input(type='StudentId',v-model.number='form.StudentId')
                    el-form-item(label='作业文件')
                        el-upload.upload-demo(ref='upload', action='/upload', :on-preview='handlePreview',:on-success="submitForm",:on-error="handleError",:on-exceed="handleExceed",:before-remove="beforeRemove" ,:on-change='handleChange',:on-remove='handleRemove', :file-list='fileList',:auto-upload='false',:limit=1)
                            el-button(slot='trigger', size='small', type='primary') 选取文件
                            .el-upload__tip(slot='tip') 只能上传格式为{{fileTypes}}的文件。
                    el-form-item
                        el-button(type='primary', @click='onSubmit(\'form\')') 提交作业
                        el-button(@click="resetForm(\'form\')") 重置
</template>
<style lang="stylus">
    @import '../../styles/home/index.styl';
</style>
<script>
    export default {
        inject: ['reload'],
        data() {
            return {
                fileList: [],
                form: {
                    StudentId: ''
                },
                fileCount: 0,
                fileUpload: false,
                jobName: '',
                jobContent: '',
                fileTypes:'',
                data: [{ value: 0, name: "未交人数" }, { value: 0, name: "已交人数" }],
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
                        console.log(_this.fileList.length);
                        if(_this.fileCount != 1 || this.fileUpload){
                            if(this.fileUpload){
                                _this.$message.warning('已经上传过了，重新选择文件再次尝试上传！！');
                            }else{
                                _this.$message.warning('必须选择一个文件才能提交！');
                            }
                        }else{
                            //执行表单提交以及文件上传
                            _this.$refs.upload.submit();
                        }
                    } else {
                        console.log('error submit!!');
                        _this.$message.warning('作业无法提交请检查输入是否完整！');
                        return false;
                    }
                });
            },
            handleRemove(file, fileList) {
                // console.log(file, fileList);
                this.fileCount = 0;
                // console.log(this.fileCount);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleChange(file, fileList){
                if(file){
                    this.fileCount = 1;
                }
                this.fileUpload = false;
                // console.log(file);
                // console.log('---------------');
                // console.log(fileList);
                // console.log(this.fileCount);
            },
            submitForm(response, file, fileList){
                //文件上传成功以后提交表单
                let formData = new FormData();
                let filename = file.response.data.name;
                //文件扩展名
                let arr = filename.split('.');
                let type = arr[arr.length-1];
                let fileTempPath = file.response.data.path;
                //封装数据
                formData.append('fileType',type);
                formData.append('fileTempPath',fileTempPath);
                formData.append('StudentId',this.form.StudentId);
                this.$http.post('/submitHomework',formData)
                    .then(response => {
                        if(response.status == 200){
                            console.log("成功");
                            this.fileUpload = true;
                            if(response.data.status == 1){
                                this.$message.success('作业提交成功，重复提交相同文件会覆盖上一次提交的文件！');
                                this.reload();
                            }else{
                                this.$message.error('作业提交失败'+ response.data.error +'！');
                            }
                            
                        }
                    })
                    .catch(function(error) {
                        console.log(error)
                        this.fileUpload = false;
                        this.$message.error('错了哦，无法访问接口！');
                    });
            },
            handleError(err, file, fileList){
                console.log(err);
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
            getInfo(){
                let _this = this;
                    // 获取未交学生列表
                    this.$http.get('/getJobInformation')
                        .then(response => {
                            if(response.status == 200){
                                console.log("成功访问数据接口");
                                console.log(response.data);
                                if(response.data){
                                    _this.jobName = response.data.data.jobName;
                                    _this.jobContent = response.data.data.jobContent;
                                    _this.data[0].value = response.data.data.unfinishedStudentNum;
                                    _this.data[1].value = response.data.data.studentNum;
                                    _this.fileTypes = response.data.data.jobTypes;
                                }
                            }
                        })
                        .catch( error => {
                            console.log(error);
                        });
                    
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
        }
    }

</script>
