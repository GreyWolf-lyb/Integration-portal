<template>
  <div class="complete-matter">
    <List
      title="已阅事项"
      :dataList="dataList"
      :listNum="num"
      @pageSizeClick="pageSizeClick"
      @pageNumberClick="pageNumberClick"
    ></List>
  </div>
</template>
<script>
import List from "@/components/list";
export default {
  components: {
    List,
  },
  data() {
    return {
      dataList: [],
      num: 0,
    };
  },
  mounted() {
    this.initialData({ type: 1, status: 1, page: 1 });
  },
  methods: {
    // 任务列表默认数据
    initialData(data) {
      this.taskList(data).then((res) => {
        this.dataList = res.data;
      });
      this.taskNum({ type: 1, status: 1 }).then((res) => {
        this.num = res.data;
      });
    },
    pageSizeClick(val) {},
    pageNumberClick(val) {
      this.initialData({ type: 1, status: 1, page: val });
    },
  },
};
</script>