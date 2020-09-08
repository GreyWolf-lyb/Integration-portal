<template>
  <el-main class="lunbo-main" v-loading="Loading">
    <el-row>
      <el-form :inline="true" class="el-InputForm">
        <el-form-item>
          <el-input
            clearable
            size="medium"
            placeholder="请输入角色名称"
            prefix-icon="el-icon-search"
            v-model="SearchItem.name"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="search"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="add"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 调用表格 -->
      <el-col :span="24">
        <tableForm
          :table-data="tableData"
          :table-label="tableHeader"
          :table-option="tableOption"
        ></tableForm>
      </el-col>
      <!-- 调用分页 -->
      <el-col :span="24">
        <paging ref="pager" :total="total" @pageChange="pageChange"></paging>
      </el-col>
    </el-row>

    <drawer
      :modal-objjr="modalObjjr"
      ref="callDetailR"
      @Reload="initial"
    ></drawer>
  </el-main>
</template>

<script>
import {
  getNodeList,
  deNodeModel,
  getServiceList,
  deServiceModel,
  getRoleList,
  deDatabase,
  getDatabaseList,
  deleteRole,
  getRoleId,
  insertRole,
  updateRole,
  findAllNodes
} from "@/api/omManger/comments";
import tableForm from "@/components/table/TableList.vue";
import paging from "@/components/table/Pagination.vue";
import drawer from "./role";
export default {
  components: {
    tableForm,
    paging,
    drawer
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
      tableHeader: [
        {
          id: false,
          type: "",
          label: "角色名称",
          list: "name"
        },
        {
          id: false,
          type: "",
          label: "描述",
          list: "remark"
        },
        {
          id: false,
          type: "",
          label: "创建时间",
          list: "createTime"
        }
      ],
      tableOption: {
        label: "操作",
        width: "300px",
        value: 3,
        options: [
          {
            label: "编辑",
            key: 0,
            type: "success",
            State: false,
            method: row => {
              this.editT(row);
            }
          },
          {
            label: "删除",
            key: 0,
            type: "danger",
            State: false,
            method: row => {
              this.delete(row);
            }
          },
          {
            label: "权限分配",
            key: 0,
            type: "info",
            State: false,
            method: row => {
              this.$router.push({
                path: "/roleList",
                query: {
                  id: row.id,
                  name: row.name
                }
              });
            }
          }
        ]
      },
      Loading: false,
      modalObjjr: "",
      total: 0, // 总条数
      currentPage: 1, // 起始页
      pageSize: 20 // 条数
    };
  },

  mounted() {
    this.initial();
  },

  methods: {
    async initial() {
      const that = this;
      try {
        let findUrl = null;
        let data = this.SearchItem;
        data.page = this.currentPage;
        data.size = this.pageSize;
        const response = await getRoleList(data);
        that.tableData = response.data.data.content;
        that.total = response.data.data.totalElements;
      } catch (even) {
        that.$message.error("数据获取失败");
      }
    },
    search() {
      this.currentPage = 1
      Object.entries(this.SearchItem).map(item => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.initial();
    },
    add: function() {
      let that = this;
      that.modalObjjr = "添加";
      that.$refs.callDetailR.initial(false);
    },
    editT: function(row) {
      let that = this;
      that.modalObjjr = "编辑";
      that.$refs.callDetailR.initial(row.id);
    },
    role(data) {
      this.$router.push({ path: "roleList" });
    },
    success(data) {
      let that = this;
      if (data.code === 1) {
        that.$message.success(data.msg);
        that.initial();
      } else {
        that.$message.error(data.msg);
      }
    },

    delete(row) {
      const that = this;
      that
        .$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          type: "warning"
        })
        .then(async () => {
          that.Loading = true;
          const response = await deleteRole(row.id);
          that.Loading = false;
          if (response.data.code === 1) {
            that.$message.success("删除成功");
            that.initial();
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    pageChange(item) {
      this.currentPage = item.page;
      this.pageSize = item.limit;
      Object.entries(this.SearchItem).map(item => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.initial();
    }
  }
};
</script>

<style lang="scss" scoped>
.lunbo-tab {
  margin-top: 10vh;
}
.lunbo-main {
  position: relative;

  .lunbo-btn {
    position: absolute;
    top: 0;
    left: 0px;
  }
}
input {
  width: 50vw;
}
.el-button--primary {
  color: #fff;
  background-color: #5a6e8a;
  border-color: #5a6e8a;
}
</style>
