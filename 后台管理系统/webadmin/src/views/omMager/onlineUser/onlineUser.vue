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
          ></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select
            clearable
            v-model="SearchItem.enabled"
            placeholder="请选择状态"
          >
            <el-option label="未启用" value="2"></el-option>
            <el-option label="已启用" value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            @click="SearchNoteList"
            icon="el-icon-search"
            >搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <TableList
        @updateUser="updateUser"
        :table-data="tableData"
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
  </el-main>
</template>

<script>
import { findAllByOnline, updateUserStatus } from "@/api/omManger/onlineUser";
import TableList from "@/components/table/TableList.vue";
import Pagination from "@/components/table/Pagination.vue";
export default {
  components: { TableList, Pagination },
  data() {
    return {
      tableData: [],
      tableHeader: [
        {
          id: false,
          type: "",
          label: "用户名",
          list: "username",
        },
        {
          id: false,
          type: "",
          label: "状态",
          list: "enabledText",
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
      SearchItem: {
        name: ""
      },
      lastItem: {
        name: ""
      },
      options: [],
      total: 0,
      pageSize: "20",
      currentPage: "1",
      RootUrl: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const data = this.SearchItem;
      data.page = this.currentPage;
      data.size = this.pageSize;
      try {
        const res = await findAllByOnline(data);
        if (res.data.code === 1) {
          res.data.data.content.forEach((item) => {
            if (item.username !== "admin") {
              item.operation = [
                {
                  label: item.enabled ? "禁用" : "启用",
                  type: item.enabled ? "danger" : "success",
                  State: false,
                  click: "updateUser",
                },
              ];
            }
            item.enabledText = item.enabled ? "启用" : "禁用";
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
    updateUser(row) {
      const that = this;
      let enabled = row.enabled;
      that
        .$confirm("你确定要" + (enabled ? "禁用" : "启用") + "吗?", "提示", {
          type: "warning",
        })
        .then(async () => {
          let obj = {
            userId: row.id,
            status: !enabled,
          };
          const response = await updateUserStatus(obj);
          if (response.data.code === 1) {
            that.$message.success((enabled ? "禁用" : "启用") + "成功");
            this.getList();
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    SearchNoteList() {
      this.currentPage = 1
      Object.entries(this.SearchItem).map(item => {
        this.lastItem[item[0]] = this.SearchItem[item[0]];
      });
      this.getList();
    },
    pageChange(item) {
      this.pageSize = item.limit;
      this.currentPage = item.page;
      Object.entries(this.SearchItem).map(item => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.getList();
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



