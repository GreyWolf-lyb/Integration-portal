<template>
  <div class="wait-for">
    <List
      title="代办任务"
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
  methods: {
    pageSizeClick(val) {},
    pageNumberClick(val) {},
  },
};
</script>