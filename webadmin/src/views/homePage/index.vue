<template>
  <div class="home-content">
    <div ref="contentWidth" class="right-content">
      <div :style="{width:widthStyle+'px'}" class="img-back">
        <swiper
          v-if="imgPicUrl.length>1"
          class="swiper-content"
          ref="mySwiper"
          :options="swiperOptions"
        >
          <swiper-slide class="swiper-img-item" v-for="item in imgPicUrl" :key="item.id">
            <img :src="item.iconAbsolutePath" @click="imgPicUrlDetails(item.id)" alt />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <center-content></center-content>
    </div>
    <div v-if="modular.isRl||modular.isKjbg||modular.isXwdt" class="right-nav">
      <right-content></right-content>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";
import CenterContent from "@/components/centerContent";
import RightContent from "@/components/rightContent";
export default {
  components: {
    swiper,
    swiperSlide,
    CenterContent,
    RightContent,
  },
  data() {
    return {
      widthStyle: "",
      modular: {
        isRl: false,
        isKjbg: false,
        isXwdt: false,
      },
      imgPicUrl: [],
      swiperOptions: {
        speed: 1000,
        autoplay: {
          delay: 2000, // 自动切换的时间间隔（单位ms）
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,
        loop: true,
      },
    };
  },
  mounted() {
    this.userInfo({ id: sessionStorage.getItem("id") }).then((res) => {
      if (res.data.template === "3") {
        this.widthStyle = document.body.clientWidth - 445;
      } else {
        this.widthStyle = document.body.clientWidth - 565;
      }
      let mod = JSON.parse(res.data.module);
      if (mod.homeType.indexOf("日程管理") > -1) {
        this.modular.isRl = true;
      }
      if (mod.homeType.indexOf("快捷办公") > -1) {
        this.modular.isKjbg = true;
      }
      if (mod.homeType.indexOf("新闻动态") > -1) {
        this.modular.isXwdt = true;
      }
    });
    this.imgUrlData();
  },
  methods: {
    imgPicUrlDetails(id) {
      this.$router.push({
        path: "/information/details",
        query: {
          id,
        },
      });
    },
    // 轮播图接口
    imgUrlData() {
      this.article({ categoryId: "lbt" }).then((res) => {
        if (res.code === 1) {
          this.imgPicUrl = res.data.content;
        }
      });
    },
  },
};
</script>
<style less="scss" scoped>
.home-content {
  width: 100%;
  display: flex;
}
.right-content {
  flex: 1;
  margin: 10px;
  box-sizing: border-box;
}
.img-back {
  width: 650px;
  height: 170px;
}
.swiper-content {
  width: 100%;
  height: 100%;
}
.swiper-img-item img {
  display: block;
  width: 100%;
  height: 100%;
}
.right-nav {
  width: 325px;
}
</style>
