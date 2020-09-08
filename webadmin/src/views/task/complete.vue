<template>
  <div class="complete-list">
    <List
      title="已办任务"
      :dataList="dataList"
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
    };
  },
  mounted() {
    // this.initialData();
  },
  methods: {
    // 任务列表默认数据
    // initialData(type = 0, status = 1) {
    //   this.taskList({ type, status }).then(res => {
    //     this.dataList = res.data;
    //   });
    //   this.taskNum({ type: 0, status: 1 }).then(res => {
    //     this.num = res.data;
    //   });
    // },
    pageSizeClick(val) {},
    pageNumberClick(val) {},
  },
};
</script>