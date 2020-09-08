<template>
  <div class="synopsis-synopsis">
    <div class="synopsis-content">
      <!-- <h2 class="synopsis-title">{{title}}</h2>
      <div class="synopsis-time">发布时间：{{createTime}} &nbsp;&nbsp;&nbsp;&nbsp; 来源：{{srcName}}</div>
      <hr />-->
      <div v-html="messageWeb"></div>
    </div>
    <div class="synopsis-footer">
      <el-button @click="retureClick">返 回</el-button>
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
      srcName: ""
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.dataData();
  },
  methods: {
    dataData() {
      this.articleFindById({ id: this.id }).then(res => {
        if (res.code === 1) {
          this.title = res.data.title;
          this.srcName = res.data.srcName;
          this.createTime = res.data.createTime;
          this.messageWeb = res.data.messageWeb;
        }
      });
    },
    retureClick() {
      history.go(-1);
    }
  }
};
</script>
<style lang="scss" scope>
.synopsis-synopsis {
  background: #eee;
  min-height: 600px;
  padding: 30px 100px;
  .synopsis-content {
    background: #fff;
    border-radius: 10px;
    padding: 30px;
    .synopsis-title {
      text-align: center;
      font-size: 20px;
    }
    .synopsis-time {
      text-align: center;
      line-height: 40px;
    }
  }
  .synopsis-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
