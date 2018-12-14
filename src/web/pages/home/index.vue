<template lang="pug">
    el-container(class='container')
        el-header(class='header') Help-Teacher
            span 作业标题:{{jobName}}
            span 作业详情:{{jobContent}}
        el-container
            el-aside(width='50%')
                #app(width='100%')
                    el-table(:data='tableData', stripe='', style='width: 100%',v-loading='loading',element-loading-text='拼命加载中',element-loading-spinner='el-icon-loading',element-loading-background='rgba(0, 0, 0, 0.8)')
                        el-table-column(prop='id', label='学号', width='180')
                        el-table-column(prop='name', label='姓名', width='100')
                        el-table-column(prop='sex', label='性别', width='100')
                        el-table-column(prop='state', label='状态', width='100')


            el-main(class='main',width='50%') 交作业
                el-form(ref='form', :model='form', label-width='200px')
                    el-form-item(label='学号',prop='StudentId',:rules="[\
          { required: true, message: '学号不能为空'},\
          { type: 'number', message: '学号必须为数字值'}\
          ]")
                        el-input(type='StudentId',v-model.number='form.StudentId')
                    el-form-item(label='作业文件')
                        el-upload.upload-demo(ref='upload', action='/upload', :on-preview='handlePreview',:on-success="submitForm",:on-error="handleError",:on-exceed="handleExceed",:before-remove="beforeRemove" ,:on-change='handleChange',:on-remove='handleRemove', :file-list='fileList',:auto-upload='false',:limit=1)
                            el-button(slot='trigger', size='small', type='primary') 选取文件
                            .el-upload__tip(slot='tip') 只能上传格式为的文件。
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
                tableData: [],
                pagesize: 10,
                currpage: 1,
                fileCount: 0,
                fileUpload: false,
                loading: true,
                jobName: '',
                jobContent: ''
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
                            this.$message.success('作业提交成功，重复提交相同文件会覆盖上一次提交的文件！');
                            this.reload();
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
            getlist(){
                let _this = this;
                    // 获取未交学生列表
                    this.$http.get('/getUnfinishedStudents')
                        .then(response => {
                            if(response.status == 200){
                                console.log("成功访问数据接口");
                                // for(const student of response.data){
                                //     _this.tableData.push({
                                //         'id' : student.id,
                                //         'name' : student.name,
                                //         'sex' : student.sex,
                                //         'state': '未交'
                                //     });
                                // }
                                _this.tableData = response.data; 
                                _this.loading = false;
                            }
                        })
                        .catch( error => {
                            console.log(error);
                        });
                    
            }
        },
        mounted() {
            this.getlist();
        }
    }

</script>