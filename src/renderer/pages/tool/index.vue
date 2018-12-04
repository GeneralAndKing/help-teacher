<template lang="pug">
  el-table(:data="tableData4" style="width: 100%" max-height="250")
    el-table-column(fixed prop="id" label="学号" width="150")
    el-table-column(prop="name" label="姓名" width="120")
    el-table-column(prop="performance" label="成绩" width="120")
    el-table-column(fixed="right" label="操作" width="120")
      template(slot-scope="scope")
        el-button(@click.native.prevent="deleteRow(scope.$index, tableData4)"
          type="text" size="small") 移除
</template>

<script>
export default {
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    }
  },
  data() {
    return {
      tableData4: [
        {
          id: "201607010244",
          name: "樊国睿",
          performance: 3.72
        },
        {
          id: "201607010244",
          name: "樊国睿",
          performance: 3.72
        },
        {
          id: "201607010244",
          name: "樊国睿",
          performance: 3.72
        },
        {
          id: "201607010244",
          name: "樊国睿",
          performance: 3.72
        },
        {
          id: "201607010244",
          name: "樊国睿",
          performance: 3.72
        },
        {
          id: "201607010244",
          name: "樊国睿",
          performance: 3.72
        }
      ]
    };
  }
};
</script>