<template>
  <div class="home">
    <el-container>
      <!-- header -->
      <el-header>
        <div class="header-layout">
          <div class="left-layout">
            <div v-if="isCollapse" class="isLeftNav is-left-nav" @click="homeRouterClick">
              <img src="@/assets/homeSvg/导航-首页.svg" alt />
            </div>
            <div
              style="cursor: pointer;"
              :class="titleClassStyle?'header-title':'title-back'"
              @click="homeRouterClick"
            >综合集成门户</div>
            <div v-if="!isCollapse" class="isLeftNav" @click="homeRouterClick">
              <img src="@/assets/homeSvg/导航-首页.svg" alt />
              <div class="home-text">首页</div>
            </div>
            <div
              style="cursor:pointer"
              v-if="!isHeader&&!isCollapse&&leftLayout"
              :class="classGateway"
              v-on:mouseover="gatewayClick"
              v-on:mouseout="removeActive"
            >
              <i class="el-icon-s-grid"></i>
              <span>我的门户</span>
              <!-- 门户导航 -->
              <div v-show="isGateway" class="header-nav">
                <div
                  v-if="item.name!=='数据开放网站'&&item.name!=='共享网站'"
                  v-for="(item,index) in navList"
                  :key="index"
                  @click="JumpUrl(item.srcUrl)"
                >
                  <img :src="'http://106.116.160.122:8081/resourceLib'+item.pic" />
                  <!-- <img :src="'http://10.15.1.20/resourceLib'+item.pic" /> -->
                  <span>{{item.name}}</span>
                </div>
              </div>
            </div>
            <div class="web-url" v-for="item in navList" :key="item.id">
              <div
                class="share-web to-open-up"
                v-if="item.name==='数据开放网站'||item.name==='共享网站'"
                @click="JumpUrl(item.srcUrl)"
              >
                <img :src="'http://106.116.160.122:8081/resourceLib'+item.pic" alt />
                <!-- <img :src="'http://10.15.1.20/resourceLib'+item.pic" /> -->
                <span>{{item.name}}</span>
              </div>
            </div>
            <div class="query-input">
              <span>人员</span>
              <input
                type="text"
                v-model="keyword"
                placeholder="请输入关键词查询"
                @keyup.enter="searchClick(keyword)"
              />
              <i @click="searchClick(keyword)" class="el-icon-search"></i>
            </div>
          </div>
          <div class="user-info">
            <div class="message-alert" style="cursor:pointer" @click="clickNews">
              <img src="@/assets/homeSvg/消息.svg" alt />
            </div>
            <div class="head-portrait">
              <img :src="titlePic" alt />
            </div>
            <div class="user-name" style="cursor:pointer" @click="suerClick">
              <span>{{userName}}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <ul v-show="isSetUp" class="user-setUp">
              <li @click="modifyClick">修改密码</li>
              <li @click="layoutClick">布局选择</li>
              <li @click="templateTtyle">模板样式</li>
              <li @click="returnClick">退出登录</li>
            </ul>
          </div>
        </div>
      </el-header>
      <!-- 显示头部导航 -->
      <header class="nav-header" v-if="isHeader">
        <div class="left-icon" @click="headerNavClick(-1)">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="center-nav-icon">
          <ul :style="{'marginLeft':left+'px'}">
            <li
              :class="haedNavIndex===index?'activeNavStyle':''"
              v-if="item.name!=='数据开放网站'&&item.name!=='共享网站'"
              v-for="(item,index) in navList"
              :key="index"
              @click="headerClick(index,item)"
            >
              <img :src="'http://106.116.160.122:8081/resourceLib'+item.pic" alt />
              <!-- <img :src="'http://10.15.1.20/resourceLib'+item.pic" alt /> -->
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="right-icon" @click="headerNavClick(1)">
          <i class="el-icon-arrow-right"></i>
        </div>
      </header>
      <!-- content -->
      <div class="center-lauty">
        <div class="left-nav">
          <left-nav v-if="leftLayout" :isCollapse="isCollapse"></left-nav>
          <pattern-nav v-if="!leftLayout" :isCollapse="isCollapse"></pattern-nav>
        </div>
        <section class="section-content" style="padding: 8px 10px;">
          <el-breadcrumb
            :style="{marginLeft:'15px'}"
            v-if="this.$route.path!=='/index'"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item>当前位置:</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumb[0]}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumb[1]}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </section>
      </div>
      <!-- footer -->
      <el-footer>
        <footer-content></footer-content>
      </el-footer>
    </el-container>
    <!-- 选择布局弹框 -->
    <el-dialog title="布局选择" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="layout-style">
        <div
          :class="isLayout===1?'layout-item active-layout':'layout-item'"
          @click="layoutStyleClick(0)"
        >
          <img src="@/assets/homeSvg/layout/默认显示布局.svg" alt />
          <i v-if="isLayout===1" class="el-icon-success"></i>
        </div>
        <div
          :class="isLayout===2?'layout-item active-layout':'layout-item'"
          @click="layoutStyleClick(1)"
        >
          <img src="@/assets/homeSvg/layout/顶部栏展示布局.svg" alt />
          <i v-if="isLayout===2" class="el-icon-success"></i>
        </div>
        <div
          :class="isLayout===3?'layout-item active-layout':'layout-item'"
          @click="layoutStyleClick(2)"
        >
          <img src="@/assets/homeSvg/layout/侧边栏展示布局.svg" alt />
          <i v-if="isLayout===3" class="el-icon-success"></i>
        </div>
        <div
          :class="isLayout===4?'layout-item active-layout':'layout-item'"
          @click="layoutStyleClick(3)"
        >
          <img src="@/assets/homeSvg/layout/极简模式布局.svg" alt />
          <i v-if="isLayout===4" class="el-icon-success"></i>
        </div>
      </div>
      <div class="layout-style">
        <div class="layout-text">默认显示</div>
        <div class="layout-text">顶部栏展示</div>
        <div class="layout-text">侧边栏展示</div>
        <div class="layout-text">极简模式</div>
      </div>
    </el-dialog>
    <!-- 模板样式 -->
    <el-dialog title="模板样式" :visible.sync="templateFlag" width="50%" :before-close="handleClose">
      <div class="template-style">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="首页模板：">
            <el-checkbox-group v-model="form.homeType">
              <el-checkbox label="通知公告"></el-checkbox>
              <el-checkbox label="日程管理"></el-checkbox>
              <el-checkbox label="快捷办公"></el-checkbox>
              <el-checkbox label="新闻动态"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="form.homeTaskType">
              <el-checkbox label="待办任务"></el-checkbox>
              <el-checkbox label="待阅任务"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="驾驶舱模板：">
            <el-checkbox-group v-model="form.cockpitMemory">
              <el-checkbox label="cpu"></el-checkbox>
              <el-checkbox label="内存"></el-checkbox>
              <el-checkbox label="物理磁盘"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="form.timeArr">
              <el-checkbox label="今日"></el-checkbox>
              <el-checkbox label="7日"></el-checkbox>
              <el-checkbox label="30日"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="form.numberArr">
              <el-checkbox label="系统访问量"></el-checkbox>
              <el-checkbox label="系统在线人数"></el-checkbox>
              <el-checkbox label="待办数量排名"></el-checkbox>
              <el-checkbox label="待阅任务完成情况"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="footer-button-style">
          <el-button @click="templateClick">保 存</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 添加日程弹框 -->
    <add-schedule></add-schedule>
  </div>
</template>

<script>
import { mapState } from "vuex";

import LeftNav from "@/components/leftNav";
import FooterContent from "@/components/footer";
import AddSchedule from "@/components/addSchedule";
import PatternNav from "@/components/patternNav";
export default {
  name: "Home",
  components: {
    LeftNav,
    FooterContent,
    AddSchedule,
    PatternNav,
  },
  computed: {
    ...mapState("user", ["info"]),
  },
  data() {
    return {
      keyword: "",
      isCollapse: false,
      className: "el-icon-s-unfold",
      isGateway: false,
      classGateway: "icon-nav",
      isSetUp: false,
      dialogVisible: false,
      isLayout: 1,
      haedNavIndex: 0,
      isHeader: false,
      leftLayout: true,
      titleClassStyle: true,
      navList: [],
      breadcrumb: [], //面包屑
      userName: "",
      titlePic: "",
      left: 0,
      templateFlag: false,
      form: {
        homeType: [],
        homeTaskType: [],
        cockpitMemory: [],
        timeArr: [],
        numberArr: [],
      },
    };
  },
  mounted() {
    this.navListData().then((res) => {
      this.navList = res.data;
    });
    this.userLoginInformation();
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        // 在函数中可以写自己的判断 to是要去的路由，from来时的路由
        this.breadcrumb = [];
        this.breadcrumb.push(to.meta.title);
        this.breadcrumb.push(to.meta.name);
      },
    },
    isCollapse(val) {
      if (val) {
        this.className = "el-icon-s-unfold";
      } else {
        this.className = "el-icon-s-fold";
      }
    },
  },
  methods: {
    // 模板显示隐藏
    templateTtyle() {
      this.templateFlag = true;
      this.isSetUp = false;
    },
    // 保存模板
    templateClick() {
      let data = JSON.stringify(this.form);
      this.TemplateStyleLayout({ module: data }).then((res) => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success",
            offset: 60,
          });
          this.templateFlag = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    },
    homeRouterClick() {
      this.$router.push("/index");
    },
    clickNews() {
      this.$router.push("/information/remind");
    },
    // 头部导航左右按钮
    headerNavClick(num) {
      if (num > -1) {
        this.left = 0;
      } else if (this.left < -200) {
        this.left = -200;
      } else {
        this.left = this.left + num * 100;
      }
    },
    // 修改布局
    layoutListFlag(num) {
      this.TemplateLayout({ template: num + "" }).then((res) => {
        this.$message({
          message: res.msg,
          type: "success",
          offset: 60,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    },
    searchClick(keyword) {
      this.$router.push({
        path: "/mailList/see",
        query: {
          keyword,
        },
      });
    },
    userLoginInformation() {
      this.userInfo({ id: sessionStorage.getItem("id") }).then((res) => {
        this.userName = res.data.name;
        this.titlePic = res.data.icon;
        if (res.data.module) {
          this.form = JSON.parse(res.data.module);
        }
        if (res.data.template == 0) {
          this.isLayout = 1;
          this.isHeader = false;
          this.isCollapse = false;
          this.leftLayout = true;
          this.titleClassStyle = true;
          this.dialogVisible = false;
        } else if (res.data.template == 1) {
          this.isLayout = 2;
          this.isHeader = true;
          this.isCollapse = false;
          this.leftLayout = true;
          this.titleClassStyle = true;
          this.dialogVisible = false;
        } else if (res.data.template == 2) {
          this.isLayout = 3;
          this.isHeader = false;
          this.isCollapse = false;
          this.leftLayout = false;
          this.titleClassStyle = true;
          this.dialogVisible = false;
        } else if (res.data.template == 3) {
          this.isLayout = 4;
          this.isCollapse = true;
          this.isHeader = false;
          this.leftLayout = false;
          this.titleClassStyle = false;
          this.dialogVisible = false;
        }
      });
    },
    // 头部导航
    headerClick(index, item) {
      this.haedNavIndex = index;
      window.location.href = item.srcUrl;
    },
    // 跳转系统路径
    JumpUrl(url) {
      window.location.href = url;
      sessionStorage.clear("token");
      sessionStorage.clear("id");
    },
    // 控制门户导航
    gatewayClick() {
      this.isGateway = true;
      this.classGateway = "active-icon";
    },
    removeActive() {
      this.isGateway = false;
      this.classGateway = "icon-nav";
    },
    // 点击用户名
    suerClick() {
      this.isSetUp = !this.isSetUp;
    },

    // 修改密码
    modifyClick() {
      this.$router.push("/personal/password");
    },
    // 选择布局
    layoutClick() {
      this.dialogVisible = true;
      this.isSetUp = false;
    },
    // 布局显示页面
    layoutStyleClick(num) {
      if (num === 0) {
        //默认布局
        this.isLayout = 1;
        this.isHeader = false;
        this.isCollapse = false;
        this.leftLayout = true;
        this.titleClassStyle = true;
        this.dialogVisible = false;
        this.layoutListFlag(num);
      } else if (num === 1) {
        //顶部栏展示
        this.isLayout = 2;
        this.isHeader = true;
        this.isCollapse = false;
        this.leftLayout = true;
        this.titleClassStyle = true;
        this.dialogVisible = false;
        this.layoutListFlag(num);
      } else if (num === 2) {
        //侧边栏展示
        this.isLayout = 3;
        this.isHeader = false;
        this.isCollapse = false;
        this.leftLayout = false;
        this.titleClassStyle = true;
        this.dialogVisible = false;
        this.layoutListFlag(num);
      } else if (num === 3) {
        //极简模式
        this.isLayout = 4;
        this.isCollapse = true;
        this.isHeader = false;
        this.leftLayout = false;
        this.titleClassStyle = false;
        this.dialogVisible = false;
        this.layoutListFlag(num);
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 推出登录
    returnClick() {
      sessionStorage.clear("token");
      window.location.href =
        // "http://10.15.1.41:9001/auth/realms/share/protocol/openid-connect/logout?redirect_uri=http://10.15.1.20/integration_manage";
      "http://106.116.160.122:9001/auth/realms/share/protocol/openid-connect/logout?redirect_uri=http://106.116.160.122:8081/integration_manage";
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  background: $home-background-color;
  .footer-button-style {
    display: flex;
    justify-content: center;
  }
  .center-lauty {
    display: flex;
    .left-nav {
      background: #15253a;
      min-height: 525px;
    }
    .section-content {
      flex: 1;
    }
  }
  .nav-header {
    height: 40px;
    background: #40a9ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .left-icon,
    .right-icon {
      height: 40px;
      font-size: 18px;
      background: #40a9ff;
      line-height: 40px;
      color: #fff;
    }
    .left-icon {
      position: relative;
      z-index: 10;
    }
    .center-nav-icon {
      flex: 1;
      overflow-y: visible;
      ul {
        width: 200%;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        margin-top: 15px;
        li {
          margin: 0 5px;
          padding: 5px;
          box-sizing: border-box;
          color: #fff;
          cursor: pointer;
          img {
            margin-top: -3px;
            width: 14px;
            height: 14px;
            color: #222222;
          }
        }
        .activeNavStyle {
          color: #fff;
          border-radius: 2px;
        }
      }
    }
  }
  .header-layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    .left-layout {
      display: flex;
      align-items: center;
      .web-url {
        display: flex;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        .share-web,
        .to-open-up {
          display: flex;
          align-items: center;
        }
        img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
          margin-left: 10px;
        }
      }
    }
    .header-title {
      background: #008df7;
      line-height: 60px;
      width: 200px;
      text-align: center;
      color: $font-color-white;
    }
    .title-back {
      background-color: #0270c1;
      line-height: 60px;
      width: 200px;
      text-align: center;
      color: $font-color-white;
    }
    .isLeftNav {
      width: 100px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      img {
        width: 21px;
      }
    }
    .is-left-nav {
      width: 80px;
      background-color: #008df7;
    }
    .icon-nav {
      color: $font-color-white;
      display: flex;
      align-items: center;
      padding: 15px 10px;
      i {
        font-size: 20px;
      }
      span {
        font-size: 16px;
      }
    }
    .active-icon {
      padding: 18px 10px;
      color: $font-color-long;
      background: $long-background-color;
      position: relative;
      i {
        font-size: 20px;
      }
      span {
        font-size: 16px;
      }

      .header-nav {
        width: 530px;
        position: absolute;
        left: 0;
        top: 50px;
        background: $long-background-color;
        z-index: 100;
        display: flex;
        flex-wrap: wrap;
        padding: 20px 10px;
        box-sizing: border-box;
        box-shadow: 0px 5px 5px #d9d9d9;
        cursor: pointer;
        div {
          width: 90px;
          height: 90px;
          margin-left: 10px;
          margin-bottom: 10px;
          background: #0270c1;
          padding: 5px;
          padding-top: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          // justify-content: center;
          align-items: center;
          img {
            width: 20px;
          }
          span {
            flex: 1;
            font-size: 12px;
            color: #fff;
            display: flex;
            align-items: center;
            line-height: 16px;
            text-align: center;
          }
        }
      }
    }
    .query-input {
      display: flex;
      align-items: center;
      border: 1px solid #fff;
      color: #fff;
      padding: 5px 10px;
      margin-left: 15px;
      span {
        border-right: 1px solid #fff;
        padding-right: 10px;
        margin-right: 10px;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      color: #fff;
      position: relative;
      .head-portrait {
        width: 30px;
        height: 30px;
        background: #fff;
        border-radius: 30px;
        margin-right: 10px;
        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .message-alert {
        width: 20px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .user-setUp {
        background: #fff;
        position: absolute;
        color: #343434;
        top: 35px;
        right: -10px;
        width: 100px;
        height: 120px;
        line-height: 28px;
        border-radius: 2px;
        z-index: 100;
        border: 0.5px solid #d9d9d9;
        text-align: center;
        cursor: pointer;
        :after {
          content: "";
          width: 0;
          height: 0;
          position: absolute;
          top: -8px;
          right: 10px;
          border-width: 0 8px 8px;
          border-style: solid;
          border-color: transparent transparent #fff;
        }
      }
    }
  }

  .layout-style {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    .layout-item {
      width: 100px;
      height: 110px;
      border: 0.5px solid #d5d5d5;
      padding: 0 5px;
      box-sizing: border-box;
      position: relative;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      i {
        position: absolute;
        right: 4px;
        bottom: 4px;
        color: #008df7;
        font-size: 20px;
      }
    }
    .active-layout {
      border-color: #008df7;
      box-shadow: 0 0 5px #008df7;
    }
    .layout-text {
      color: #222222;
      font-weight: bold;
    }
  }
}
input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #fff;
}
.el-header,
.el-footer {
  background-color: $header-background-color;
  color: #333;
  // text-align: center;
  height: 82px;
  padding: 0;
}
.el-footer {
  height: 150px !important;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: $home-background-color;
  color: #333;
  text-align: center;
  height: auto;
}

body > .el-container {
  margin-bottom: 40px;
  // @include w_h_size;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
