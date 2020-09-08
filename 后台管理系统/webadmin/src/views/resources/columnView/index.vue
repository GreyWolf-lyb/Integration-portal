<template>
  <el-main>
    <el-form :inline="true">
      <el-form-item>
        <el-input
          clearable
          size="medium"
          placeholder="请输入栏目名称"
          prefix-icon="el-icon-search"
          v-model="SearchItem.name"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="SearchNoteList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="add">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table class="el_tab_alage" :data="tableData" style="width: 100%">
      <el-table-column align="center" min-width="25%" prop="id" label="栏目id"></el-table-column>
      <el-table-column align="center" min-width="25%" prop="name" label="栏目名称"></el-table-column>
      <el-table-column align="center" min-width="25%" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" min-width="25%" label="操作">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row)" type="success" size="small">编辑</el-button>
          <el-button
            @click="deleteClick(scope.row)"
            type="danger"
            size="small"
          >删除</el-button>
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
    <columnAdd :title="title" ref="add" @Reload="initialList"></columnAdd>
  </el-main>
</template>
<script>
import columnAdd from "./columnAdd";
import Pagination from "@/components/table/Pagination.vue";
import {
  categoryList,
  categoryDelete
} from "@/api/resources";
export default {
  components: {
    columnAdd,
    Pagination
  },
  data() {
    return {
      tableData: [],
      SearchItem: {
        name: ""
      },
      lastItem: {
        name: ""
      },
      total: 0,
      pageSize: "10",
      currentPage: 1,
      title: "",
    };
  },
  created() {
    this.initialList();
  },
  methods: {
    // 点击搜索
    SearchNoteList() {
      this.currentPage = 1
      Object.entries(this.SearchItem).map(item => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.initialList();
    },
    // 点击添加文件夹
    add() {
      this.title = "添加";
      this.$refs.add.initial();
    },
    // 初始数据列表
    initialList() {
      let data = {
        name: this.SearchItem.name,
        page: this.currentPage,
        size: this.pageSize,
      };
      categoryList(data).then(res => {
        this.tableData = res.data.data.content;
        this.total = res.data.data.totalElements;
      });
    },
    pageChange(item) {
      this.pageSize = item.limit;
      this.currentPage = item.page;
      Object.entries(this.SearchItem).map((item) => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.initialList();
    },
    editClick(row) {
      this.title = "编辑";
      this.$refs.add.initial(row.id);
    },
    // 删除
    deleteClick(row) {
      const that = this;
      that
        .$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          type: "warning"
        })
        .then(async () => {
          const response = await categoryDelete({ id: row.id });
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
    }
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
<style>
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
.el-message-box__title {
  text-align: center;
}
.el-message-box__content {
  display: flex;
  align-items: center;
}
</style>
