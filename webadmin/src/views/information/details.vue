<template>
  <div class="hboder">
    <ul>
      <div class="main_title">{{ title }}</div>
      <div class="main_time">发布时间：{{ createTime }} &nbsp;&nbsp;&nbsp;&nbsp; 来源：{{srcName}}</div>
      <hr />
      <div v-html="messageWeb" v-if="messageWeb" style="text-align: left;"></div>
      <div v-else style="text-align: center;">暂无数据</div>
    </ul>
    <div class="footer-button" style="text-align: center;">
      <el-button @click="resetForm">返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "",
      createTime: "",
      messageWeb: "",
      srcName: "",
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.detatil();
  },
  methods: {
    detatil() {
      this.articleFindById({ id: this.id }).then((res) => {
        if (res.code === 1) {
          this.title = res.data.title;
          this.srcName = res.data.srcName;
          this.createTime = res.data.createTime;
          this.messageWeb = res.data.messageWeb;
        }
      });
    },
    resetForm() {
      history.go(-1);
    },
  },
};
</script>
<style lang="scss">
.hboder {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  .main_title {
    width: 95%;
    text-align: center;
    font-size: 18px;
    padding: 40px 0px;
    margin: 0px 20px;
  }
  .main_time {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #999;
    padding-bottom: 40px;
  }
}
</style>