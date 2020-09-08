<template>
  <div class="station-information">
    <List
      :title="'新闻动态'"
      :dataList="dataList"
      :listNum="listNum"
      @pageSizeClick="pageSizeClick"
      @pageNumberClick="pageNumberClick"
      @articleClick="articleClick"
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
      dataList: {
      },
      listNum: 0,
    };
  },
  created() {
    this.getList({ categoryId: "xwdt", page: 1 });
  },
  methods: {
    getList(data) {
      this.article(data).then((res) => {
        if (res.code === 1) {
          this.dataList = res.data;
          this.listNum = res.data.totalElements;
        }
      });
    },
    articleClick(e) {
      this.$router.push({
        path: "/information/details",
        query: {
          id: e,
        },
      });
    },
    pageSizeClick(val) {},
    pageNumberClick(val) {
      this.getList({ categoryId: "xwdt", page: val });
    },
  },
};
</script>