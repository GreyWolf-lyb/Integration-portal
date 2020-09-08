<template>
  <div class="to-do">
    <div class="to-do-title">
      <h2>{{title}}</h2>
      <span v-if="listNum">{{listNum}}</span>
    </div>
    <ul class="to-do-list">
      <div style="text-align:center;line-height:50px" v-if="!dataList.content">暂无数据</div>
      <li v-for="(item,index) in dataList.content" :key="index" @click="articleClick(item)">
        <p class="list-title-style">{{item.title}}</p>
        <span>{{item.createTime}}</span>
      </li>
    </ul>
    <div class="to-do-pagination">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        :total="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    dataList: {},
    listNum: Number,
  },
  data() {
    return {
      currentPage: 1,
      totalNumber: 0,
    };
  },
  watch: {
    dataList() {
      this.totalNumber = this.dataList.totalElements;
    },
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.$emit("pageSizeClick", val);
    },
    handleCurrentChange(val) {
      this.$emit("pageNumberClick", val);
    },
    articleClick(item) {
      if (this.title === "待办事项" || this.title === "已办事项") {
        window.location.href = item.url;
      }
      this.$emit("articleClick", item.id);
    },
  },
};
</script>
<style less="scss" scoped>
.to-do {
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
  border-radius: 4px 4px 4px 0;
  box-sizing: border-box;
  font-size: 12px;
}
.to-do-list {
  padding: 10px 40px;
  min-height: 400px;
  box-sizing: border-box;
}
.to-do-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #343434;
  border-bottom: 1px dashed #e7e7e7;
  height: 50px;
  list-style-type: disc;
  cursor: pointer;
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
  width: 150px;
}
.to-do-pagination {
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
}
</style>
<style>
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
  border: 0.5px solid #999999;
  padding: 0 4px;
}
</style>
