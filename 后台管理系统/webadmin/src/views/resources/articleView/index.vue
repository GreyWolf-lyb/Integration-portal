<template>
  <el-main>
    <el-form :inline="true">
      <el-form-item>
        <el-input
          clearable
          size="medium"
          placeholder="请输入标题"
          prefix-icon="el-icon-search"
          v-model="SearchItem.title"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="SearchNoteList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="add">添加</el-button>
      </el-form-item>
    </el-form>
    <TableForm
      ref="table"
      :tableList="tableList"
      :categoryId="categoryId"
      @deleteClick="deleteClick"
    ></TableForm>
    <!-- <div class="pagination-style">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div> -->
    <el-col :span="24">
      <pagination
        ref="page"
        :total="total"
        @pageChange="pageChange"
      ></pagination>
    </el-col>
  </el-main>
</template>
<script>
import TableForm from "@/components/tableList";
import { artList, artDelete } from "@/api/resources";
import Pagination from "@/components/table/Pagination.vue";
export default {
  components: {
    TableForm,
    Pagination
  },
  data() {
    return {
      categoryId: "",
      tableList: [],
      SearchItem: {
        title: ""
      },
      lastItem: {
        title: ""
      },
      total: 0,
      pageSize: "10",
      currentPage: 1,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        this.currentPage = 1
        this.SearchItem.title = ''
        this.urlJson();
        this.initialList();
      }
    }
  },
  mounted() {
    this.urlJson();
  },
  methods: {
    urlJson() {
      this.categoryId = this.$route.query.id;
      this.common.session("categoryId", this.categoryId);
    },
    // 初始数据
    initialList() {
      let data = { 
        categoryId: this.categoryId,
        title: this.SearchItem.title,
        page: this.currentPage,
        size: this.pageSize
      }
      artList(data).then(res => {
        this.tableList = res.data.data.content;
        this.total = res.data.data.totalElements;
      });
    },
    deleteClick(id) {
      const that = this;
      that
        .$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          type: "warning"
        })
        .then(async () => {
          const response = await artDelete({id});
          if (response.data.code === 1) {
            that.$message.success(response.data.msg);
            this.initialList();
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    // 添加
    add() {
      document.name = '文章添加'
      this.$router.push({
        name: "addArticle",
        path: "/addArticle",
        query: this.$route.query,
        params: {
          is: "add"
        }
      });
    },
    // 查询
    SearchNoteList(text) {
      this.currentPage = 1
      Object.entries(this.SearchItem).map(item => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.initialList();
    },
    pageChange(item) {
      this.pageSize = item.limit;
      this.currentPage = item.page;
      Object.entries(this.SearchItem).map(item => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.initialList();
    },
    // handleSizeChange(val) {
    //   this.pageSize = val
    //   this.initialList();
    // },
    // handleCurrentChange(val) {
    //   this.currentPage = val
    //   this.initialList();
    // }
  }
};
</script>
<style lang="scss" scoped>
.pagination-style {
  padding: 30px 20px;
  display: flex;
  justify-content: flex-end;
}
</style>