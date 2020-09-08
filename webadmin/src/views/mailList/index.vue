<template>
  <el-container style="height:700px;margin:10px; border: 1px solid #EEF1F6">
    <el-aside style="width:200px;background-color: rgb(238, 241, 246)">
      <div style="width:200px;line-height:50px;border-bottom:1px solid #E6E6E6;">
        <div style="margin-left:12px;font-size:16px;font-weight:600;">组织结构</div>
      </div>
      <el-input
        style="width:180px;margin:0px 8px;color:#000;line-height:70px;"
        suffix-icon="el-icon-search"
        placeholder="组织结构"
        v-model="filterText"
      ></el-input>
      <el-tree
        style="width:180px;margin:5px 8px"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :data="dataTree"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>
    </el-aside>
    <el-container style="width:67vw">
      <el-main>
        <div style="width:100%;line-height:50px;border-bottom:1px solid #E6E6E6;">
          <div style="margin-left:30px;font-size:16px;font-weight:600;">通讯录查看</div>
        </div>
        <div style="margin:0 4px;">
          <div class="input" style="margin-left:30px;">
            <span class="title" style="width:4vw">用户名 :</span>
            <el-input style="width:11vw;color:#000;" placeholder="请输入用户名" v-model="pname" clearable></el-input>
          </div>
          <div class="input">
            <span class="title" style="width:4vw">手机号 :</span>
            <el-input style="width:11vw;color:#000;" placeholder="请输入手机号" v-model="ptel" clearable></el-input>
          </div>
          <div class="input">
            <span class="title" style="width:3vw">邮箱 :</span>
            <el-input style="width:15vw;color:#000;" placeholder="请输入邮箱" v-model="pemail" clearable></el-input>
          </div>
          <el-button @click="search" type="primary">查 询</el-button>
        </div>
        <div style="width:62vw;overflow-x:scoll;">
          <el-table v-loading="loading" :data="tableData" stripe>
            <el-table-column prop="name" label="用户名" width="100"></el-table-column>
            <el-table-column prop="tel" label="手机号" width="120"></el-table-column>
            <el-table-column prop="deptName" label="所属部门" width="80"></el-table-column>
            <el-table-column prop="job" label="所属岗位" width="250"></el-table-column>
            <el-table-column prop="duty" label="职务" width="80"></el-table-column>
            <el-table-column prop="sex" label="性别" width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.sex==0">男</span>
                <span v-if="scope.row.sex==1">女</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          </el-table>
        </div>
        <div class="page_fy">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="page"
            prev-text="上一页"
            next-text="下一页"
            layout="prev, pager, next, jumper"
            :total="num"
          ></el-pagination>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      err: "", //报错内容
      page: 10, //当前页条数
      num: 10, //自定义页数
      filterText: "", //组织结构搜索框绑定值
      pname: "", //搜索姓名绑定值
      pemail: "", //搜索邮箱绑定值
      ptel: "", //搜索手机绑定值
      currentPage: 1,
      //表格数据
      tableData: [],
      //组织结构tree数据
      dataTree: [],
      defaultProps: {
        children: "subGroups",
        label: "name",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    $route: {
      immediate: true,
      handler(to, from) {
        let user = this.$route.query.keyword;
        this.getMailListData({ name: user });
      },
    },
  },
  created() {
    this.dataList();
    let user = this.$route.query.keyword;
    this.getMailListData({ name: user });
  },
  methods: {
    dataList() {
      // 组织树
      this.treeDepartment().then((res) => {
        this.dataTree = res.data;
      });
    },
    // 通讯录列表
    getMailListData(data = null) {
      this.getMailList(data).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data.content;
          this.num = res.data.totalElements;
        }
      });
    },
    //组织结构树过滤函数
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //组织结构点击函数
    handleNodeClick(data) {
      this.getMailListData({ dept: data.id });
    },
    //条数函数
    handleSizeChange(val) {},
    //页数函数
    handleCurrentChange(val) {
      this.getMailListData({ page: val });
    },
    //搜索函数
    search() {
      this.getMailListData({
        name: this.pname,
        tel: this.ptel,
        email: this.pemail,
      });
    },
  },
};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 10px;
}

.el-aside {
  color: #333;
}
.el-main {
  padding: 0 !important;
  background: #ffffff;
}
.se {
  width: calc(100%-400px) !important;
}
.input {
  display: inline-block;
  margin: 18px 10px;
}
.title {
  display: inline-block;
  line-height: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-input__inner {
  height: 30px !important;
}
.el-input__icon {
  line-height: 30px !important;
}
.el-button {
  padding: 6px 20px;
  margin: 0px 0px 10px 30px;
  overflow: hidden;
}
.el-table {
  margin-left: 30px;
}
/* 如果每页条数超过10条，可以用这个样式 --开始*/
.is-scrolling-none {
  height: 90%;
  overflow-y: scroll;
}
/*如果每页条数超过10条，可以用这个样式 --结束 */
.page_fy {
  width: 50%;
  margin: 20px auto;
  height: 50px;
}
.el-tree-node__content {
  height: 40px;
  color: #000;
}
.el-icon-caret-right:before {
  /* color: #000; */
  width: 10px;
}
/* 如果需要提示文字居中可以用以下样式--开始*/
.el-dialog--center .el-dialog__body {
  text-align: center;
}
.el-table .cell {
  text-align: center;
}
/* 如果需要提示文字居中可以用以下样式--结束*/
.el-table td {
  padding: 7px 0 !important;
}
.el-input__suffix {
  line-height: 30px !important;
}
</style>
