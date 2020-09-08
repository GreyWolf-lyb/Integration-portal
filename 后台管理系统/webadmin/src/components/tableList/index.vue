<template>
  <el-table class="el_tab_alage" :data="tableList" style="width: 100%">
    <el-table-column align="center" prop="title" label="标题"></el-table-column>
    <el-table-column align="center" prop="categoryName" label="栏目名称"></el-table-column>
    <el-table-column v-if="categoryId=='kjbg'" align="center" prop="srcUrl" label="来源路径"></el-table-column>
    <el-table-column align="center" prop="author" label="作者"></el-table-column>
    <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
    <el-table-column align="center" width="300" label="操作">
      <template slot-scope="scope">
        <el-button @click="editClick(scope.row)" type="success" size="small">编辑</el-button>
        <el-button
          @click="detailsClick(scope.row)"
          type="success"
          size="small"
        >详情</el-button>
        <el-button
          @click="deleteClick(scope.row)"
          type="danger"
          size="small"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    tableList: Array,
    categoryId: String
  },
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
  },
  methods: {
    // 编辑
    editClick(row) {
      document.name = '文章编辑'
      this.$router.push({
        name: "addArticle",
        path: "/addArticle",
        query: this.$route.query,
        params: {
          id: row.id,
          is: "edit"
        }
      });
    },
    // 删除
    deleteClick(row) {
      this.$emit("deleteClick", row.id);
    },
    // 详情
    detailsClick(row) {
      document.name = '文章详情'
      this.$router.push({
        name: "addArticle",
        path: "/addArticle",
        query: this.$route.query,
        params: {
          id: row.id,
          is: "details"
        }
      });
    }
  }
};
</script>
<style lang="scss">
.el-button--text {
  color: #5a6e8a;
}
.el-table thead {
  color: #909399;
  font-weight: 500;
}
</style>