<template>
  <el-main>
    <el-form :inline="true">
      <el-form-item>
        <el-input
          clearable
          size="medium"
          placeholder="请输入文件夹名称"
          prefix-icon="el-icon-search"
          v-model="SearchItem.folderName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="SearchNoteList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="add">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table class="el_tab_alage" :data="tableList" style="width: 100%;">
      <el-table-column
        align="center"
        prop="folderName"
        label="文件夹名称"
        min-width="30%"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
        min-width="30%"
      ></el-table-column>
      <el-table-column align="center" min-width="40%" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="resourceManagement(scope.row)"
            type="success"
            size="small"
            >资源库管理</el-button
          >
          <el-button @click="editClick(scope.row)" type="success" size="small"
            >编辑</el-button
          >
          <el-button @click="deleteClick(scope.row)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <pagination
        ref="page"
        :total="total"
        @pageChange="pageChange"
      ></pagination>
    </el-col>
    <fileAdd :title="title" ref="add" @Reload="getList"></fileAdd>
  </el-main>
</template>
<script>
import fileAdd from "./fileAdd";
import { fileManagementList, deleteFile } from "@/api/resources";
import Pagination from "@/components/table/Pagination.vue";
export default {
  components: {
    fileAdd,
    Pagination
  },
  data() {
    return {
      title: "",
      tableList: [],
      SearchItem: {
        folderName: ""
      },
      lastItem: {
        folderName: ""
      },
      total: 0,
      pageSize: "10",
      currentPage: 1,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 点击搜索
    SearchNoteList() {
      this.currentPage = 1
      Object.entries(this.SearchItem).map(item => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.getList();
    },
    // 点击添加文件夹
    add() {
      this.title = "添加";
      this.$refs.add.initial();
    },
    // 请求默认列表数据
    getList() {
      let data = {
        folderName: this.SearchItem.folderName,
        page: this.currentPage,
        size: this.pageSize,
      };
      fileManagementList(data).then((res) => {
        this.tableList = res.data.data.content;
        this.total = res.data.data.totalElements;
      });
    },
    pageChange(item) {
      this.pageSize = item.limit;
      this.currentPage = item.page;
      Object.entries(this.SearchItem).map((item) => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.getList();
    },
    // 点击资源管理
    resourceManagement(row) {
      this.common.session("folderId", row.id);
      this.$router.push({
        // name: "repositoryView",
        path: "/repositoryView",
        params: {
          id: row.id,
        },
      });
    },
    // 点击编辑
    editClick(row) {
      this.title = "编辑";
      this.$refs.add.initial(row.id);
    },
    // 点击删除
    deleteClick(row) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        type: "warning",
      })
        .then(async () => {
          deleteFile({ id: row.id }).then((res) => {
            if (res.data.code === 1) {
              this.$message({
                type: "success",
                message: res.data.msg,
              });
              this.getList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-button--primary {
  color: #fff;
  background-color: #5a6e8a;
  border-color: #5a6e8a;
}
.el-button--primary:hover {
  background: #7b8ba1;
  border-color: #7b8ba1;
  color: #fff;
}
.pagination-style {
  padding: 30px 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
<style>
.el-message-box__title {
  text-align: center;
}
.el-message-box__content {
  display: flex;
  align-items: center;
}
</style>