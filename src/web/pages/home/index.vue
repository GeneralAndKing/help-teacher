<template lang="pug">
  el-container
    el-header Help-Teacher
      span 作业标题:{{jobName}}
      span 作业详情:{{jobContent}}

      
    el-container
      el-aside(width='500px') Aside
      el-main Main 
        el-form.demo-ruleForm(:model='numberValidateForm', ref='numberValidateForm', label-width='100px')
          el-form-item(label='年龄', prop='age', :rules="[\
          { required: true, message: '年龄不能为空'},\
          { type: 'number', message: '年龄必须为数字值'}\
          ]")
            el-input(type='age', v-model.number='numberValidateForm.age', autocomplete='off')
          el-form-item
            el-button(type='primary', @click="submitForm('numberValidateForm')") 提交
            el-button(@click="resetForm('numberValidateForm')") 重置

</template>
<style lang="stylus">
</style>
<script>
  export default {
    data() {
      return {
        numberValidateForm: {
          age: ''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
