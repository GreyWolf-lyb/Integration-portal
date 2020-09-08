<template>
  <div class="remind-information">
    <div class="to-do-title">
      <h2 :class="this.activeIndex===1?'active-title':''" @click="activeClick(1)">日程提醒</h2>
      <span>{{totalNum1}}</span>
      <h2 :class="this.activeIndex===2?'active-title':''" @click="activeClick(2)">任务提醒</h2>
      <span>{{totalNum2}}</span>
    </div>
    <ul class="to-do-list">
      <li v-if="listData.length<1" style="text-align:center;border:0">暂无数据</li>
      <li v-for="item in listData" :key="item.id" @click="detailsClick(item)">
        <div class="list-text">
          <p>{{item.title}}</p>
          <span>{{item.createTime}}</span>
        </div>
        <p class="stact-time">开始时间: {{item.beginTime}}</p>
      </li>
    </ul>
    <div class="to-do-pagination">
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
    <el-dialog title="详情" :visible.sync="dialogVisible" width="40%">
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
export default {
  data() {
    return {
      currentPage: 1,
      activeIndex: 1,
      listData: [],
      totalNum1: 0,
      totalNum2: 0,
      totalNum: 0,
      dialogVisible: false,
      detailsObj: {},
    };
  },
  mounted() {
    this.initialData(0, null);
    this.totalNumberData();
  },
  methods: {
    detailsClick(item) {
      this.dialogVisible = true;
      this.scheduleDetails({ id: item.scheduleId }).then((res) => {
        this.detailsObj = res.data;
      });
    },
    initialData(num, page) {
      this.messageList({ type: num, page }).then((res) => {
        this.listData = res.data.content;
        this.totalNum = res.data.totalElements;
      });
    },
    totalNumberData() {
      this.messageList({ type: 0 }).then((res) => {
        this.totalNum1 = res.data.totalElements;
      });
      this.messageList({ type: 1 }).then((res) => {
        this.totalNum2 = res.data.totalElements;
      });
    },
    activeClick(num) {
      this.activeIndex = num;
      if (this.activeIndex === 1) {
        this.initialData(0);
      } else if (this.activeIndex === 2) {
        this.initialData(1);
      }
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      if (this.activeIndex === 1) {
        this.initialData(0, val);
      } else if (this.activeIndex === 2) {
        this.initialData(1, val);
      }
    },
  },
};
</script>
<style less="scss" scoped>
.active-title {
  border-bottom: 2px solid #0270c1;
  line-height: 52px;
}
.remind-information {
  background: #fff;
  margin: 10px;
  box-sizing: border-box;
}
.to-do-title {
  height: 52px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid #d5d5d5;
  font-size: 16px;
  box-sizing: border-box;
}
.to-do-title h2 {
  margin-bottom: 0px !important;
}
.to-do-title span {
  background: #0270c1;
  color: #fff;
  height: 16px;
  line-height: 16px;
  padding: 0 3px;
  margin-left: 5px;
  margin-right: 100px;
  border-radius: 4px 4px 4px 0;
  box-sizing: border-box;
  font-size: 12px;
}
.to-do-list {
  min-height: 400px;
  padding: 10px 40px;
  box-sizing: border-box;
}
.to-do-list li .list-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #343434;
  list-style-type: disc;
}

.to-do-list li {
  padding: 10px 0;
  line-height: 30px;
  border-bottom: 1px solid #e7e7e7;
  box-sizing: border-box;
}

.to-do-list li p {
  margin-bottom: 0px !important;
  width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.to-do-list li span {
  color: #555555;
  font-size: 13px;
}
.to-do-pagination {
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
}
.dialog-style {
  width: 80%;
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
}
.dialog-style strong {
  display: block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
.dialog-style span {
  flex: 1;
}
</style>
<style>
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
  border: 0.5px solid #999999;
  padding: 0 4px;
}
</style>