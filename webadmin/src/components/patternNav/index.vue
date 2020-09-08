<template>
  <div class="class-menu">
    <a-menu
      :style="{width:isCollapse?'80px':'200px'}"
      mode="vertical"
      theme="dark"
      :selectable="false"
      :open-keys="openKeys"
      @openChange="onOpenChange"
      :inline-collapsed="isCollapse"
    >
      <a-sub-menu key="sub1">
        <span slot="title">
          <img class="left-img-svg" src="@/assets/homeSvg/leftNav/集成门户.svg" alt />
          <span v-if="!isCollapse">集成门户</span>
        </span>
        <a-sub-menu
          v-if="item.meta.name!=='首页'"
          v-for="(item,index) in list"
          :key="index"
          :title="item.meta.name"
        >
          <a-menu-item
            v-if="subItem.meta.name!=='详情'"
            v-for="subItem in item.children"
            :key="subItem.path"
            @click="routerClick(subItem)"
          >{{subItem.meta.name}}</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu
        v-if="item.name!=='数据开放网站'&&item.name!=='共享网站'"
        v-for="(item,index) in navList"
        :key="index"
        @click="routerUrl(item.srcUrl)"
      >
        <span slot="title">
          <img style="width:16px;" :src="'http://106.116.160.122:8081/resourceLib'+item.pic" />
          <!-- <img style="width:16px;" :src="'http://10.15.1.20/resourceLib'+item.pic" /> -->
          <span v-if="!isCollapse">{{item.name}}</span>
        </span>
        <a-menu-item :key="item.path" @click="routerUrl(item.srcUrl)">{{item.name}}</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
export default {
  props: {
    isCollapse: Boolean,
  },
  data() {
    return {
      list: [],
      rootSubmenuKeys: this.$router.options.routes[1].children,
      openKeys: [],
      navList: [],
    };
  },
  mounted() {
    this.list = this.$router.options.routes[1].children;
    this.navListData().then((res) => {
      this.navList = res.data;
    });
  },
  methods: {
    // 跳转路由
    routerClick(route) {
      this.$router.push(route.path);
    },
    routerUrl(url) {
      window.location.href = url;
      sessionStorage.clear("token");
      sessionStorage.clear("id");
    },
    // 只展开一个菜单
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      let arr = [];
      this.rootSubmenuKeys.forEach((item) => {
        arr.push(item.path);
      });
      if (arr.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.left-img-svg {
  width: 14px;
  height: 14px;
  margin-right: 10px;
}
</style>
<style>
.left-icon {
  width: 20px;
  height: 20px;
}
.ant-menu-root.ant-menu-inline {
  width: 200px;
  background-color: #15253a;
}
.ant-menu-dark,
.ant-menu-dark .ant-menu-sub {
  background-color: #15253a;
}
.ant-menu-dark .ant-menu-submenu-title .ant-menu-submenu-arrow,
.ant-menu-dark .ant-menu-sub .ant-menu-submenu-title .ant-menu-submenu-arrow {
  display: none;
}
</style>
