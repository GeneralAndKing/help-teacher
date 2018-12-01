<template>
  <el-row type="flex" class="row-bg" justify="space-around">
    <el-col :span="6">
      <el-card>
        <img class="image">
          <span>学生信息管理</span>
          <div>
            <el-button type="primary" @click="student">click</el-button>
          </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <img class="image">
          <span>作业收取</span>
          <div>
            <el-button type="primary" @click="about">click</el-button>
          </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <img class="image">
          <span>其他工具</span>
          <div>
            <el-button type="primary" @click="about">click</el-button>
          </div>
      </el-card>
    </el-col>
  </el-row>
</template>


<style>
.image {
  width: 100%;
  display: block;
}
</style>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    };
  },
  methods: {
    about(item, index) {
      this.$router.push({ name: "about" });
    },
    student(item, index) {
      this.$router.push({ name: "student" });
    }
  }
};
</script>