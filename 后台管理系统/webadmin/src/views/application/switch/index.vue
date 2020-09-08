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
          <el-select style="width: 100%;" clearable v-model="SearchItem.sysState" placeholder="请选择状态">
            <el-option label="未启用" value="2"></el-option>
            <el-option label="已启用" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="SearchNoteList" icon="el-icon-search">搜索</el-button>
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
      <pagination ref="page" :total="total" @pageChange="pageChange"></pagination>
    </el-col>
    <drawer :modal-objj="modalObjj" ref="callDetaill" @Reload="SearchNoteList"></drawer>
  </el-main>
</template>

<script>
import { getList, stop, Start } from "@/api/application/switch";
import TableList from "@/components/table/TableList.vue";
import Pagination from "@/components/table/Pagination.vue";
import drawer from "./add";
// import md5 from "js-md5";
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
          type: "",
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
        }
      ],
      tableOpction: {
        label: "操作",
        width: "400px",
        value: 0 ,
        options: [
          {
            label: "启用",
            key: 0,
            type: "success",
            State: false,
            method: row => {
              this.startUp(row);
            }
          },
          {
            label: "停止",
            key: 1,
            type: "danger",
            State: false,
            method: row => {
              this.stop(row);
            }
          }
        ]
      },
      isSubmitLoading: false,
      stoplistiD: [],
      modalObjj: "",
      options: [],
      total: 0,
      pageSize: "20",
      currentPage: "1",
      SearchItem: {
        name: ""
      },
      lastItem: {
        name: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let data = {
        name: this.SearchItem.name,
        sysState: this.SearchItem.sysState,
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
    SearchNoteList() {
      this.currentPage = 1;
      Object.entries(this.SearchItem).map((item) => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.fetchData();
    },
    startUp: function(row) {
      const that = this;
      that
        .$confirm("你确定要启用吗?", "提示", {
          type: "warning"
        })
        .then(async () => {
          that.Loading = true;
          const response = await Start({ id: row.id });
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
    pageChange(item) {
      this.pageSize = item.limit;
      this.currentPage = item.page;
      Object.entries(this.SearchItem).map((item) => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.fetchData();
    },

    // 删除当前单条数据 重载列表
    stop(row) {
      const that = this;
      that
        .$confirm("你确定要停止吗?", "提示", {
          type: "warning"
        })
        .then(async () => {
          that.Loading = true;
          const response = await stop({ id: row.id });
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



