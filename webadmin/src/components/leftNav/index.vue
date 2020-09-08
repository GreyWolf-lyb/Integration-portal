<template>
  <div class="class-menu">
    <a-menu
      mode="inline"
      theme="dark"
      :selectable="false"
      :open-keys="openKeys"
      @openChange="onOpenChange"
      :inline-collapsed="isCollapse"
    >
      <template v-for="item in list">
        <a-sub-menu v-if="item.path!=='/index'" :key="item.path">
          <span slot="title">
            <img class="icon-img-svg" :src="[item.meta.icon]" alt />
            <span>{{item.meta.title}}</span>
          </span>
          <a-menu-item
            v-for="subItem in item.children"
            :key="subItem.path"
            v-if="subItem.meta.isFlag"
            @click="routerClick(subItem)"
          >{{subItem.meta.name}}</a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
export default {
  props: {
    isCollapse: Boolean
  },
  data() {
    return {
      list: [],
      rootSubmenuKeys: this.$router.options.routes[1].children,
      openKeys: []
    };
  },
  mounted() {
    this.list = this.$router.options.routes[1].children;
  },
  methods: {
    // 跳转路由
    routerClick(route) {
      this.$router.push(route.path);
    },
    // 只展开一个菜单
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      let arr = [];
      this.rootSubmenuKeys.forEach(item => {
        arr.push(item.path);
      });
      if (arr.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-img-svg {
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
/* .ant-menu-dark,
.ant-menu-inline,
.ant-menu-sub {
  background: #101d2e !important;
} */
</style>
