<template>
  <el-main>
    <el-col :span="24">
      <el-form :inline="true" class="el-InputForm">
        <el-form-item>
          <el-input
            clearable
            size="medium"
            placeholder="请输入操作员"
            prefix-icon="el-icon-search"
            v-model="SearchItem.operator"
            @keyup.enter.native="SearchNoteList"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            @click="SearchNoteList"
            icon="el-icon-search"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <TableList
        :table-data="tableData"
        v-loading="isSubmitLoading"
        :table-label="tableHeader"
        :table-option="tableOpction"
      ></TableList>
    </el-col>
    <el-col :span="24">
      <pagination
        ref="page"
        :total="total"
        @pageChange="pageChange"
      ></pagination>
    </el-col>
    <drawer
      :modal-objj="modalObjj"
      ref="callDetaill"
      @Reload="SearchNoteList"
    ></drawer>
  </el-main>
</template>

<script>
import {
  getList,
  roleList,
  deUser,
  updateStatus,
  setPasswd,
} from "@/api/log/log";
import TableList from "@/components/table/TableList.vue";
import Pagination from "@/components/table/Pagination.vue";
import drawer from "./add";
export default {
  components: { TableList, Pagination, drawer },
  data() {
    return {
      drawer: false,
      tableData: [],
      tableHeader: [
        {
          id: false,
          type: "",
          label: "事件类型",
          list: "type",
        },
        {
          id: false,
          type: "",
          label: "操作员",
          list: "operator",
        },
        {
          id: false,
          type: "",
          label: "操作时间",
          list: "createTime",
          width: "200px",
        },
        {
          id: false,
          type: "",
          label: "事件源",
          list: "source",
        },
        {
          id: false,
          type: "",
          label: "操作对象",
          list: "operand",
        },
        {
          id: false,
          type: "",
          label: "操作结果",
          list: "result",
        },
        {
          id: false,
          type: "",
          label: "描述",
          list: "description",
        },
      ],
      tableOpction: {
        label: "操作",
        width: "120px",
        value: 0,
        options: [
          {
            label: "详情",
            key: 0,
            type: "success",
            State: false,
            method: (row) => {
              this.details(row);
            },
          },
        ],
      },
      isSubmitLoading: false,
      DeletelistiD: [],
      modalObjj: "",
      options: [],
      total: 0,
      pageSize: "20",
      currentPage: "1",
      SearchItem: {
        operator: "",
      },
      lastItem: {
        operator: "",
      },
    };
  },
  created() {
    // this.findNodes();
    console.log(this.SearchItem, "搜索参数");
    this.fetchData();
  },
  methods: {
    //获取列表信息(接口)
    async fetchData() {
      let data = {
        operator: this.SearchItem.operator,
        page: this.currentPage,
        size: this.pageSize,
      };
      try {
        const res = await getList(data);
        if (res.data.code === 1) {
          res.data.data.content.map(function (a, b) {
            if (a.result == 0) {
              a.result = "失败";
            } else if (a.result == 1) {
              a.result = "成功";
            }
          });
          this.tableData = res.data.data.content;
          this.total = res.data.data.totalElements;
        } else {
          this.$message.error(even.msg);
        }
      } catch (even) {
        this.$message.error(even.msg);
      }
    },
    SearchNoteList() {
      this.currentPage = 1
      Object.entries(this.SearchItem).map(item => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.fetchData();
    },
    add: function () {
      let that = this;
      this.modalObjj = "添加";
      this.$refs.callDetaill.initial(false);
    },
    details: function (row) {
      let that = this;
      that.modalObjj = "详情";
      that.$refs.callDetaill.initial(row.id);
    },
    pageChange(item) {
      this.pageSize = item.limit;
      this.currentPage = item.page;
      Object.entries(this.SearchItem).map(item => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.fetchData();
    },

    // 删除当前单条数据 重载列表
    delete(row) {
      const that = this;
      that
        .$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          type: "warning",
        })
        .then(async () => {
          that.Loading = true;
          const response = await deUser(row.id);
          that.Loading = false;
          if (response.data.code === 1) {
            that.$message.success("删除成功");
            this.fetchData();
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    // 删除当前单条数据 重载列表
    ban(row) {
      const that = this;
      that
        .$confirm("此操作将禁用账号, 是否继续?", "提示", {
          type: "warning",
        })
        .then(async () => {
          that.Loading = true;
          let status = "";
          if (row.status === "禁用") {
            status = 1;
          } else {
            status = 0;
          }
          let data = {
            id: row.id,
            status: status,
          };
          const response = await updateStatus(data);
          that.Loading = false;
          if (response.data.code === 1) {
            that.$message.success(response.data.msg);
            this.fetchData();
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },

    reset(row) {
      const that = this;
      that
        .$confirm("此操作将重置密码, 是否继续?", "提示", {
          type: "warning",
        })
        .then(async () => {
          that.Loading = true;
          let data = {
            id: row.id,
          };
          const response = await setPasswd(data);
          that.Loading = false;
          if (response.data.code === 1) {
            that.$message.success(response.data.msg);
            this.fetchData();
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    async findNodes(data) {
      const that = this;
      that.loading = true;
      const response = await roleList();
      that.loading = false;
      if (response.data.code === 1) {
        that.options = [];
        response.data.data.content.map(function (v, k) {
          that.options.push({ value: v.id, label: v.name });
        });
      } else {
        // 添加上传失败后 回调失败信息
        that.$message.error(response.data.msg);
        return false;
      }
    },
  },
};
</script>
<style >
.el-dropdown {
  margin: 0 0 0 2vw;
}
.el-button--primary {
  color: #fff;
  background-color: #5a6e8a;
  border-color: #5a6e8a;
}
</style>



