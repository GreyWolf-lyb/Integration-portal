<template>
  <el-scrollbar class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" router>
      <template v-for="item in menuData">
        <template v-if="item.childs.length > 0">
          <el-submenu :index="item.entity.id" :key="item.entity.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.entity.name }}</span>
            </template>
            <template v-for="subItem in item.childs">
              <el-menu-item :index="subItem.entity.route" :key="subItem.entity.id">
                <span slot="title">{{ subItem.entity.name }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.entity.index" :key="item.entity.id">
            <i :class="item.entity.icon"></i>
            <span slot="title">{{ item.entity.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import transmit from "../../../utils/transmit";
import { myMenuTree, menus } from "@/api//user";
// import { mapGetters } from 'vuex'
export default {
  name: "SideBar",
  props: {
    message: Boolean
  },
  // computed: {
  //    ...mapGetters([
  //     'sidebar'
  //   ]),
  //   isCollapse() {
  //     return !this.sidebar.opened
  //   }
  // },
  data() {
    return {
      collapse: false,
      menuData: [],
      items: [
        {
          id: "1",
          icon: "iconfont icon-wulianwang-",
          index: "1",
          title: "系统管理",
          subs: [
            {
              id: "1-1",
              index: "/user",
              title: "用户管理"
            },
            {
              id: "1-2",
              index: "/comments",
              title: "角色管理"
            }
          ]
        },
        {
          id: "2",
          icon: "iconfont icon-wulianwang-",
          index: "2",
          title: "资源管理",
          subs: [
            {
              id: "2-1",
              index: "/fileView",
              title: "文件夹管理"
            }
          ]
        },
        {
          id: "3",
          icon: "iconfont icon-wulianwang-",
          index: "3",
          title: "栏目管理",
          subs: [
            {
              id: "3-1",
              index: "/columnView",
              title: "栏目管理"
            }
          ]
        },
        {
          id: "4",
          icon: "iconfont icon-wulianwang-",
          index: "4",
          title: "文章管理",
          subs: [
            {
              id: "4-1",
              index: "/articleView?id=lbt&name=轮播图",
              title: "轮播图"
            },
            {
              id: "4-2",
              index: "/articleView?id=znxx&name=站内消息",
              title: "站内消息"
            },
            {
              id: "4-3",
              index: "/articleView?id=tzgg&name=通知公告",
              title: "通知公告"
            },
            {
              id: "4-4",
              index: "/articleView?id=kjbg&name=快捷办公",
              title: "快捷办公"
            }
          ]
        },
        {
          id: "5",
          icon: "iconfont icon-wulianwang-",
          index: "5",
          title: "应用系统管理",
          subs: [
            {
              id: "5-1",
              index: "/register",
              title: "应用管理系统"
            },
            {
              id: "5-2",
              index: "/toExamine",
              title: "待审核应用管理"
            },
            {
              id: "5-3",
              index: "/switch",
              title: "开关应用管理"
            }
          ]
        },
        {
          id: "6",
          icon: "iconfont icon-wulianwang-",
          index: "6",
          title: "日志管理",
          subs: [
            {
              id: "6-1",
              index: "/log",
              title: "日志管理"
            }
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path;
    }
  },
  created() {
    this.getList();
    transmit.$on("collapse", msg => {
      this.collapse = msg;
    });
  },
  methods: {
    async getList() {
      const that = this;
      // const row = await menus({});
      // let rowData = row.data.data
      // rowData.categorys.forEach(async item => {
      //   item.route = item.route + '?id=' + item.categoryId + '&name' + item.name
      // })
      const res = await myMenuTree({});
      if (res.data.code === 1) {
        let resData = res.data.data
        // let json = []
        // resData.forEach(async item => {
        //   if (item.entity.name === '文章管理') {
        //     let arr = []
        //     rowData.categorys.forEach(item => {
        //       arr.push({
        //         childs: [],
        //         entity: item
        //       })
        //     })
        //     json.push({
        //       childs: arr,
        //       entity: item.entity
        //     })
        //   } else {
        //     json.push(item)
        //   }
        // })
        this.menuData = resData
      }
    },
    SetParameters(key) {
      const that = this;
      if (key != null) {
        //  that.items.push(key)
        that.items = key;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: hidden;
  z-index: 999;
  text-align: left;
  background: #15253a;
  width: 100%;
  // padding: 5px;

  ul {
    height: 100%;
    background: #15253a;
  }

  .Admin {
    font-size: 22px;
    margin-right: 10px;
  }
}
.el-submenu {
  color: rgb(191, 203, 217) !important;
  background: #15253a;
  .el-submenu__title {
    color: rgb(191, 203, 217) !important;
    background: #15253a;
  }
}
.is-opened {
  background: #001f28;
}
.el-submenu__title,
.el-submenu__title span {
  color: rgb(191, 203, 217) !important;
}
.sidebar-el-menu {
  background: #15253a;
  vertical-align: middle;
}
.sidebar-el-menu span {
  padding-left: 15px;
}
.sidebar-el-menu .iconfont {
  font-size: 20px;
  font-weight: bold;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background: #001f28;
}
.el-menu-item {
  color: rgb(191, 203, 217);
}
.el-scrollbar {
  height: calc(100% - 43px);
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 230px;
}
</style>
