<template>
  <div class="schedule-page">
    <div class="schedule-list-title">
      <h2>日程管理</h2>
      <el-button type="primary" icon="el-icon-plus" @click="addSchedule">新建日程</el-button>
    </div>
    <div class="schedule-list-content">
      <div class="schedule-add-button">
        <el-form :inline="true">
          <el-form-item label="标题:">
            <el-input v-model="form.title" style="width:150px" placeholder="请输入标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="紧急程度:">
            <el-select v-model="form.state" placeholder="请选择紧急程度" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间:">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择开始时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="querySchedule">查 询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-style">
        <span v-if="isTips" class="tips-text" :style="{top:y+'px',left:x+'px'}">{{tips}}</span>
        <el-table :data="tableData" row-key="id">
          <el-table-column align="center" prop="title" label="标题"></el-table-column>
          <el-table-column align="center" prop="emergency" label="紧急程度">
            <template slot-scope="scope">
              <span v-if="scope.row.emergency == 0">一般</span>
              <span v-else-if="scope.row.emergency == 1" style="color:#008df7">重要</span>
              <span v-else style="color:#f00">紧急</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="日程状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">待处理</span>
              <span v-else style="color:#67C23A">已完成</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="180" prop="beginTime" label="开始时间"></el-table-column>
          <el-table-column align="center" width="180" prop="endTime" label="结束时间"></el-table-column>
          <el-table-column align="center" width="180" label="操作">
            <template slot-scope="scope">
              <i
                class="el-icon-circle-check item-icon-style"
                v-if="scope.row.status==='0'"
                @click="handleClick(scope.row)"
                @mouseenter="StopRoll('完成',1)"
                @mouseleave="UpRoll"
                @mousemove="coordinate"
              ></i>
              <i
                class="el-icon-close item-icon-style"
                v-if="scope.row.status==='0'"
                @click="deleteClick(scope.row)"
                @mouseenter="StopRoll('删除',2)"
                @mouseleave="UpRoll"
                @mousemove="coordinate"
              ></i>
              <i
                class="el-icon-edit-outline item-icon-style"
                v-if="scope.row.status==='0'"
                @click="editClick(scope.row)"
                @mouseenter="StopRoll('编辑',3)"
                @mouseleave="UpRoll"
                @mousemove="coordinate"
              ></i>
              <i
                class="el-icon-tickets item-icon-style"
                @click="detailsClick(scope.row)"
                @mouseenter="StopRoll('详情',4)"
                @mouseleave="UpRoll"
                @mousemove="coordinate"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="schedule-pagination">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="日程详情" :visible.sync="dialogVisible" width="40%">
      <div class="dialog-style">
        <strong>标题 :</strong>
        <span>{{detailsObj.title}}</span>
      </div>
      <div class="dialog-style">
        <strong>内容 :</strong>
        <span>{{detailsObj.content}}</span>
      </div>
      <div class="dialog-style">
        <strong>紧急程度 :</strong>
        <span>{{detailsObj.emergency==0?'一般':detailsObj.emergency==1?'重要':'紧急'}}</span>
      </div>
      <div class="dialog-style">
        <strong>开始时间 :</strong>
        <span>{{detailsObj.beginTime}}</span>
      </div>
      <div class="dialog-style">
        <strong>结束时间 :</strong>
        <span>{{detailsObj.endTime}}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 0,
      totalNum: 0,
      dialogVisible: false,
      detailsObj: {},
      tips: "",
      isTips: false,
      isTipsNum: 0,
      form: {
        title: "",
        state: "",
        startTime: "",
      },
      options: [
        {
          value: "0",
          label: "一般",
        },
        {
          value: "1",
          label: "重要",
        },
        {
          value: "2",
          label: "紧急",
        },
      ],
      x: 0,
      y: 0,
      pageNum: 1,
    };
  },
  computed: {
    ...mapState("schedule", ["isSchedule"]),
  },
  watch: {
    isSchedule(val) {
      setTimeout(() => {
        this.initialData({ page: this.pageNum });
      }, 2000);
    },
  },
  mounted() {
    this.initialData();
  },
  methods: {
    coordinate(e) {
      this.x = e.pageX - 15;
      this.y = e.pageY - 25;
    },
    StopRoll(text, num) {
      this.tips = text;
      this.isTips = true;
      this.isTipsNum = num;
    },
    UpRoll() {
      this.isTips = false;
    },
    // 条件查询
    querySchedule() {
      let data = {
        title: this.form.title,
        emergency: this.form.state,
        beginTime: this.form.startTime,
      };
      this.initialData(data);
    },
    // 完成日程
    handleClick(row) {
      this.$confirm("您确认已经完成了吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.scheduleComplete({ id: row.id }).then((res) => {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.initialData({ page: this.pageNum });
          });
        })
        .catch(() => {});
    },
    // 编辑日程
    editClick(row) {
      this.$store.dispatch("schedule/scheduleFrom", { flag: true, id: row.id });
    },
    // 删除日程
    deleteClick(row) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.scheduleDelete(row.id).then((res) => {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.initialData({ page: this.pageNum });
          });
        })
        .catch(() => {});
    },
    // 日程详情
    detailsClick(row) {
      this.dialogVisible = true;
      this.scheduleDetails({ id: row.id }).then((res) => {
        this.detailsObj = res.data;
      });
    },
    initialData(data = {}) {
      this.scheduleList(data).then((res) => {
        this.tableData = res.data.content;
        this.totalNum = res.data.totalElements;
      });
    },
    // 添加日程
    addSchedule() {
      this.$store.dispatch("schedule/scheduleFrom", { flag: true, id: "" });
    },
    handleSizeChange(val) {},
    // 分页页数
    handleCurrentChange(val) {
      this.pageNum = val;
      this.initialData({ page: val });
    },
  },
};
</script>
<style lang="scss" scope>
.schedule-page {
  background: #fff;
  .table-style {
    max-width: 1000px;
    .tips-text {
      position: absolute;
      background: rgba(0, 0, 0, 0.3);
      width: 30px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 1000;
    }
  }
  .item-icon-style {
    cursor: pointer;
    margin: 0 3px;
  }

  .schedule-list-content {
    margin: 0 auto;
    padding: 0 15px;
    min-height: 400px;
    box-sizing: border-box;
  }
  .schedule-list-title {
    border-bottom: 1px solid #999999;
    height: 52px;
    padding: 0 15px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }
  .schedule-add-button {
    margin: 20px 0;
    box-sizing: border-box;
  }
  .schedule-pagination {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dialog-style {
    width: 80%;
    margin-bottom: 20px;
    font-size: 16px;
    display: flex;
    strong {
      display: block;
      width: 100px;
      text-align: right;
      margin-right: 10px;
    }
    span {
      flex: 1;
    }
  }
}
</style>
<style>
.el-button {
  padding: 8px 12px !important;
}
.el-input__inner {
  height: 32px;
}
.demo-ruleForm,
.el-form {
  width: 100% !important;
}
/* .el-table th,
.el-table tr {
  background: #fff !important;
} */
</style>