<template>
  <div class="center-content">
    <!-- tabs -->
    <div v-if="modular.isDb||modular.isDy" class="tabs-list">
      <div class="tabs-title">
        <div class="tabs-button">
          <div v-if="modular.isDb" class="tabs-item" @click="tabsClick(1)">
            <h2 :class="tabsIndex===1?'active-item':''">待办任务</h2>
            <span>({{num1}})</span>
          </div>
          <div v-if="modular.isDy" class="tabs-item" @click="tabsClick(2)">
            <h2 :class="tabsIndex===2?'active-item':''">待阅任务</h2>
            <span>({{num2}})</span>
          </div>
        </div>
        <span style="cursor: pointer;" @click="routerClick">more +</span>
      </div>
      <ul class="list-text">
        <li v-for="item in taskListData" :key="item.id" @click="routerUrlClick(item)">
          <p>{{item.title}}</p>
          <span>{{item.createTime}}</span>
        </li>
      </ul>
    </div>
    <!-- 通知公告 -->
    <div v-if="modular.isTzgg" class="notice-notice">
      <div class="notice-title">
        <h2>通知公告</h2>
        <span style="cursor: pointer;" @click="routerNoticeClick">more +</span>
      </div>
      <div class="notice-list">
        <div
          class="notice-item"
          v-for="item in noticeList"
          :key="item.id"
          @click="noticeClick(item.id)"
        >
          <div class="notice-img">
            <img :src="item.iconAbsolutePath" alt />
          </div>
          <div class="notice-content">
            <div class="notice-title-title">
              <h2>{{item.title}}</h2>
              <span>{{item.createTime}}</span>
            </div>
            <p class="notice-text">{{item.digest}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabsIndex: 1,
      taskListData: [],
      noticeList: [],
      num1: 0,
      num2: 0,
      modular: {
        isTzgg: false,
        isDb: false,
        isDy: false,
      },
    };
  },
  mounted() {
    this.initialData();
    this.taskListNumber();
    this.userInfo({ id: sessionStorage.getItem("id") }).then((res) => {
      let mod = JSON.parse(res.data.module);
      if (mod.homeType.indexOf("通知公告") > -1) {
        this.modular.isTzgg = true;
      }
      if (mod.homeTaskType.indexOf("待办任务") > -1) {
        this.modular.isDb = true;
      }
      if (mod.homeTaskType.indexOf("待阅任务") > -1) {
        this.modular.isDy = true;
      }
    });
  },
  methods: {
    // 跳转通知公告列表
    routerNoticeClick() {
      this.$router.push("/information/notice");
    },
    // 待办 待阅 任务列表跳转
    routerUrlClick(item) {
      if (this.tabsIndex === 1) {
        window.location.href = item.url;
      }
    },
    noticeClick(id) {
      this.$router.push({
        path: "/information/details",
        query: {
          id,
        },
      });
    },
    tabsClick(num) {
      this.tabsIndex = num;
      if (this.tabsIndex === 1) {
        this.initialData(0);
      } else if (this.tabsIndex === 2) {
        this.initialData(1);
      }
    },
    // 数据总数
    taskListNumber() {
      this.taskNum({ type: 0 }).then((res) => {
        this.num1 = res.data;
      });
      this.taskNum({ type: 1 }).then((res) => {
        this.num2 = res.data;
      });
    },
    // 任务列表默认数据
    initialData(type = 0) {
      this.taskList({ type }).then((res) => {
        this.taskListData = res.data.content.slice(0, 5);
      });
      this.article({ categoryId: "tzgg" }).then((res) => {
        if (res.code === 1) {
          this.noticeList = res.data.content.slice(0, 3);
        }
      });
    },
    routerClick() {
      if (this.tabsIndex === 1) {
        this.$router.push("/business/todo");
      } else if (this.tabsIndex === 2) {
        this.$router.push("business/waitForMatter");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.center-content {
  .tabs-list {
    background: #fff;
    margin-top: 10px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    min-height: 250px;
    .tabs-title {
      height: 50px;
      display: flex;
      line-height: 50px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #d5d5d5;
      .tabs-button {
        display: flex;
        .tabs-item {
          display: flex;
          margin-right: 40px;
          align-items: center;
          cursor: pointer;
          span {
            font-size: 12px;
            padding-left: 2px;
          }
          h2 {
            margin-bottom: 0em !important;
          }
          .active-item {
            line-height: 50px;
            border-bottom: 2px solid #008df7;
          }
        }
      }
    }
    .list-text {
      margin-top: 10px;
      li {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        p {
          width: 400px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .notice-notice {
    background: #fff;
    padding: 0 10px 10px;
    box-sizing: border-box;
    margin-top: 10px;
    .notice-title {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #d5d5d5;
      h2 {
        width: 400px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .notice-list {
      .notice-item {
        margin-top: 20px;
        display: flex;
        cursor: pointer;
        .notice-img {
          width: 170px;
          height: 100px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .notice-content {
          margin-left: 20px;
          flex: 1;
          .notice-title-title {
            display: flex;
            justify-content: space-between;
            h2 {
              max-width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .notice-text {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>