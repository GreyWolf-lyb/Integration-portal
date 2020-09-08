<template>
  <el-main>
    <el-col :span="24">
      <el-form :inline="true" class="el-InputForm">
        <el-form-item>
          <el-input
            clearable
            size="medium"
            placeholder="请输入用户名"
            prefix-icon="el-icon-search"
            v-model="SearchItem.name"
            @keyup.enter.native="SearchNoteList"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            size="medium"
            placeholder="请输入手机号"
            prefix-icon="el-icon-search"
            v-model="SearchItem.tel"
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
          <el-button
            type="primary"
            size="medium"
            @click="add"
            icon="el-icon-plus"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <TableList
        @edit="edit"
        @delete="deleteData"
        @detail="detail"
        @reset="reset"
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
} from "@/api/omManger/user";
import TableList from "@/components/table/TableList.vue";
import Pagination from "@/components/table/Pagination.vue";
import drawer from "./add";
import md5 from "js-md5";
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
          label: "用户名",
          list: "name",
          width: "150",
        },
        {
          id: false,
          type: "",
          label: "手机号",
          list: "tel",
        },
        {
          id: false,
          type: "",
          label: "邮箱",
          list: "email",
        },
        {
          id: false,
          type: "",
          label: "角色",
          list: "roleName",
        },
        {
          id: false,
          type: "",
          label: "创建时间",
          list: "createTime",
          width: "180",
        },
        {
          id: false,
          type: "operation",
          label: "操作",
          list: "operation",
          width: "350",
        },
      ],
      tableOpction: {},
      isSubmitLoading: false,
      DeletelistiD: [],
      modalObjj: "",
      SearchItem: {
        name: "",
        tel: "",
      },
      lastItem: {
        name: "",
        tel: "",
      },
      options: [],
      total: 0,
      pageSize: "20",
      currentPage: "1",
      RootUrl: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //获取列表信息(接口)
    async fetchData() {
      const data = this.SearchItem;
      data.page = this.currentPage;
      data.size = this.pageSize;
      try {
        const res = await getList(data);
        if (res.data.code === 1) {
          res.data.data.content.forEach((item) => {
            item.operation = [
              {
                label: "编辑",
                type: "success",
                State: false,
                click: "edit",
              },
              {
                label: "删除",
                type: "danger",
                State: false,
                click: "delete",
              },
              {
                label: "详情",
                type: "success",
                State: false,
                click: "detail",
              },
              {
                label: "重置密码",
                type: "info",
                State: false,
                click: "reset",
              },
            ];
            if (item.id === "admin") {
              item.operation.splice(1, 1);
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
    edit: function (row) {
      let that = this;
      that.modalObjj = "编辑";
      that.$refs.callDetaill.initial(row.id);
    },
    detail: function (row) {
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
    deleteData(row) {
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
          console.log(data, "重置密码");
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
/*
.el-tabs--border-card>.el-tabs__header{
  display: none !important;
} */
.el-button--primary {
  color: #fff;
  background-color: #5a6e8a;
  border-color: #5a6e8a;
}
</style>



