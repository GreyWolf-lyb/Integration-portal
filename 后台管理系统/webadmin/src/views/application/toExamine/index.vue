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
          <el-button
            type="primary"
            size="medium"
            @click="SearchNoteList"
            icon="el-icon-search"
            >搜索</el-button
          >
          <!-- <el-button type="primary" size="medium" @click="add" icon="el-icon-add">添加</el-button> -->
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
} from "@/api/application/toExamine";
import { updateAppove } from "@/api/application/appove";
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
          list: "name",
        },
        {
          id: false,
          type: "",
          label: "系统图标",
          list: "pic",
        },
        {
          id: false,
          type: "",
          label: "系统路径",
          list: "srcUrl",
        },
        {
          id: false,
          type: "",
          label: "状态",
          list: "sysState",
        },
        {
          id: false,
          type: "",
          label: "创建时间",
          list: "createTime",
        },
      ],
      tableOpction: {
        label: "操作",
        width: "400px",
        value: 0,
        options: [
          {
            label: "通过",
            key: 0,
            type: "success",
            State: false,
            method: (row) => {
              this.adopt(row);
            },
          },
          {
            label: "驳回",
            key: 0,
            type: "danger",
            State: false,
            method: (row) => {
              this.reject(row);
            },
          },
        ],
      },
      isSubmitLoading: false,
      rejectlistiD: [],
      modalObjj: "",
      options: [],
      total: 0,
      pageSize: "20",
      currentPage: "1",
      SearchItem: {
        name: "",
      },
      lastItem: {
        name: "",
      },
      RootUrl: "",
    };
  },
  created() {
    this.fetchData();
  },
  updated() {
    // this.imgTab();
  },
  mounted() {
    // this.imgTab();
  },
  methods: {
    //把cell里面的img转为图片
    imgTab() {
      this.$nextTick(function () {
        var odiv = document.getElementsByTagName("div");
        console.log(odiv, "odiv");
        for (var i = 0; i < odiv.length; i++) {
          console.log(odiv[i].parent().parent(), "sdsds");
          if (odiv[i].className == "cell") {
            console.log(odiv[i], "sdsds");
            var parser = new DOMParser();
          }
        }
      });
    },
    //获取列表信息(接口)
    async fetchData() {
      let data = {
        name: this.SearchItem.name,
        page: this.currentPage,
        size: this.pageSize,
      };
      try {
        const res = await getList(data);

        if (res.data.code === 1) {
          var Data = res.data.data.content;
          Data.forEach((item) => {
            item.pic = process.env.VUE_APP_URL_API + item.pic;
            switch (item.sysState) {
              case "0":
                item.sysState = "待审核";
                break;
              case "1":
                item.sysState = "已驳回";
                break;
              case "2":
                item.sysState = "未启用";
                break;
              case "3":
                item.sysState = "已启用";
                break;
            }
          });
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
    reject: function (row) {
      let that = this;
      that.modalObjj = "你确定要驳回吗？";
      that.$refs.callDetaill.initial(row.id);
    },
    pageChange(item) {
      this.pageSize = item.limit;
      this.currentPage = item.page;
      Object.entries(this.SearchItem).map((item) => {
        this.SearchItem[item[0]] = this.lastItem[item[0]];
      });
      this.fetchData();
    },
    adopt(row) {
      console.log(row, "row");
      const that = this;
      that
        .$confirm("确定通过?", "提示", {
          type: "warning",
        })
        .then(async () => {
          that.Loading = true;
          var data = {
            sysState: "2",
            id: row.id,
          };
          console.log(data, "data");
          const response = await updateAppove(data);
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



