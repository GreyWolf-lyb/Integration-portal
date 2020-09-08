<template>
  <el-main>
    <el-col :span="24">
      <el-form :inline="true" class="el-InputForm">
        <el-form-item>
          <el-input
            clearable
            size="medium"
            placeholder="请输入系统名称"
            prefix-icon="el-icon-search"
            v-model="SearchItem.name"
            @keyup.enter.native="SearchNoteList"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="SearchItem.sysState" placeholder="请选择状态">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="已驳回" value="1"></el-option>
            <el-option label="未启用" value="2"></el-option>
            <el-option label="已启用" value="3"></el-option>
          </el-select>
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
      <el-table class="el_tab_alage" :data="tableData" style="width: 100%">
        <template v-for="item in tableHeader">
          <el-table-column align="center" :prop="item.list" :label="item.label">
            <template slot-scope="scope">
              <template v-if="item.type === 'img'">
                <img
                  :src="scope.row.pic"
                  width="40"
                  height="40"
                  class="head_pic"
                />
              </template>
              <template v-else>{{ scope.row[item.list] }}</template>
            </template>
          </el-table-column>
        </template>
        <el-table-column align="center" min-width="200" label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.sysState === '已驳回'">
              <el-button size="mini" type="success" @click="reapply(scope.row)"
                >重新申请</el-button
              >
              <el-button size="mini" type="success" @click="look(scope.row)"
                >驳回原因</el-button
              >
            </template>
            <el-button size="mini" type="success" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="deleteDate(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
  reapplyApi
} from "@/api/application/register";
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
          label: "系统名称",
          list: "name"
        },
        {
          id: false,
          type: "img",
          label: "系统图标",
          list: "pic"
        },
        {
          id: false,
          type: "",
          label: "系统路径",
          list: "srcUrl"
        },
        {
          id: false,
          type: "",
          label: "状态",
          list: "sysState"
        },
        {
          id: false,
          type: "",
          label: "创建时间",
          list: "createTime"
        }
      ],
      tableOpction: {},
      isSubmitLoading: false,
      DeletelistiD: [],
      modalObjj: "",
      options: [],
      total: 0,
      pageSize: "20",
      currentPage: "1",
      SearchItem: {
        name: "",
        sysState: ""
      },
      lastItem: {
        name: "",
        sysState: ""
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //获取列表信息(接口)
    async fetchData() {
      let data = {
        sysState: this.SearchItem.sysState,
        name: this.SearchItem.name,
        page: this.currentPage,
        size: this.pageSize,
      };
      try {
        const res = await getList(data);
        if (res.data.code === 1) {
          var Data = res.data.data.content;
          Data.forEach(item => {
            item.pic = process.env.VUE_APP_URL_API + item.pic
            switch (item.sysState) {
              case '0':
                item.sysState = '待审核'
                break
              case '1':
                item.sysState = '已驳回'
                break
              case '2':
                item.sysState = '未启用'
                break
              case '3':
                item.sysState = '已启用'
                break
            }
          })
          this.tableData = Data;
          this.total = res.data.data.totalElements;
        } else {
          this.$message.error(even.msg);
        }
      } catch (even) {
        this.$message.error(even.msg);
      }
    },
    handleCommand(command) {
      if (command == 4) {
        this.SearchItem.sysState = "";
      } else {
        this.SearchItem.sysState = command;
      }
      this.$message("系统状态" + this.d(command));
    },
    SearchNoteList() {
      this.currentPage = 1
      Object.entries(this.SearchItem).map(item => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.fetchData();
    },
    add: function() {
      let that = this;
      this.modalObjj = "添加";
      this.$refs.callDetaill.initial(false);
    },
    edit: function(row) {
      let that = this;
      that.modalObjj = "编辑";
      that.$refs.callDetaill.initial(row.id);
    },
    reapply(row) {
      this.$confirm("重新申请后，数据将会成为待审核状态?", "提示", {
        type: "warning"
      })
        .then(async () => {
          let data = {
            id: row.id
          };
          const response = await reapplyApi(data);
          if (response.data.code === 1) {
            this.$message.success(response.data.msg);
            this.$router.push({
              path: "/toExamine"
            });
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    look(row) {
      this.$alert(row.rejectedRemark, "驳回原因", {
        confirmButtonText: "确定",
        callback: action => {}
      });
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
    deleteDate(row) {
      const that = this;
      that
        .$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          type: "warning"
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
          type: "warning"
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
            status: status
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
          type: "warning"
        })
        .then(async () => {
          that.Loading = true;
          let data = {
            id: row.id
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
        response.data.data.content.map(function(v, k) {
          that.options.push({ value: v.id, label: v.name });
        });
      } else {
        // 添加上传失败后 回调失败信息
        that.$message.error(response.data.msg);
        return false;
      }
    }
  }
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



