<template>
  <div class="footer-content">
    <div>
      <!--<p>友情链接： 唐山市人民政府</p>-->
      <p>建设单位： 智慧神州（北京）科技有限公司</p>
      <p>Copyright 2020 智慧唐山服务平台 All Right Reserved</p>
      <p>
        友情链接：
        <span
          style="margin-right:10px;cursor: pointer;"
          v-for="item in list"
          :key="item.id"
          @click="urlClick(item.srcUrl)"
        >{{item.title}}</span>
      </p>
    </div>
    <div class="footer-nav">
      <span @click="synopsisClick('gywm')">关于我们</span> |
      <span @click="synopsisClick('ysbh')">隐私保护</span> |
      <span @click="synopsisClick('flzr')">法律责任</span> |
      <span @click="synopsisClick('ptjj')">平台简介</span>
    </div>
    <div>
      <h2>服务热线 0315-5398276</h2>
      <p class="email-text">
        <img src="@/assets/homeSvg/底部信箱.svg" alt /> 电子邮箱：editor@ccgp.gov.cn
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.friendship({ categoryId: "yqlj" }).then(res => {
      this.list = res.data.content;
    });
  },
  methods: {
    // 快速导航
    synopsisClick(id) {
      this.$router.push({
        path: "/synopsis",
        query: {
          id
        }
      });
    },
    // 友情链接
    urlClick(url) {
      window.location.href = url;
    }
  }
};
</script>
<style lang="scss" scoped>
.footer-content {
  height: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 0 40px;
  h2 {
    font-size: 24px;
    color: #fff;
  }
  .email-text {
    text-align: end;
    img {
      width: 20px;
      margin-bottom: 3px;
    }
  }
  .footer-nav {
    span {
      cursor: pointer;
    }
  }
}
</style>
