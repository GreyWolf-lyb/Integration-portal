<template>
  <div class="right-right">
    <!-- 日历 -->
    <div v-if="modular.isRl" class="calendar-data">
      <a-calendar
        valueFormat="YYYY-MM-DD hh:mm:ss"
        :fullscreen="false"
        :locale="locale"
        :header-render="headerRender"
        @panelChange="onPanelChange"
        @select="selectDataChange"
      />
      <div class="schedule-list">
        <p
          style="cursor: pointer;"
          v-for="item in dataList"
          :key="item.id"
          @click="scheduleDetailsClick(item)"
        >
          {{item.beginTime.split(' ')[1]}}
          <span class="schedule-title">{{item.title}}</span>
          <span class="schedule-content">{{item.content}}</span>
        </p>
      </div>
      <div class="add-button" @click="addSchedule">
        <img style="cursor: pointer;" src="@/assets/homeSvg/add.svg" alt />
      </div>
    </div>
    <!-- 快捷办公 -->
    <div v-if="modular.isKjbg" class="fast-office">
      <div class="office-title">
        <span>快捷办公</span>
      </div>
      <div class="nav-layout">
        <div
          style="cursor: pointer;position: relative;"
          v-for="(item,index) in workList"
          :key="item.id"
          @click="routerUrlClick(item)"
          @mouseover="changeActive(item.title,index)"
          @mouseout="removeActive()"
        >
          <i v-if="activeIndex===index&&item.title.length>4" class="active-style-text">{{textIndex}}</i>
          <img :src="item.iconAbsolutePath || '@/assets/homeSvg/office/我的待办.svg'" alt />
          <span class="icon-button-nav">{{item.title}}</span>
        </div>
      </div>
    </div>
    <!-- 动态新闻 -->
    <div v-if="modular.isXwdt" class="fast-office">
      <div class="office-title">
        <span>新闻动态</span>
        <span style="cursor: pointer;" @click="routerStationClick">more +</span>
      </div>
      <div class="list-content">
        <div
          class="list-item"
          v-for="item in newsList"
          :key="item.id"
          @click="StationClick(item.id)"
        >
          <p
            style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
          >{{item.title}}</p>
          <span>{{item.createTime}}</span>
        </div>
      </div>
    </div>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="40%">
      <div class="dialog-style">
        <strong>标题 :</strong>
        <span>{{detailsObj.title}}</span>
      </div>
      <div class="dialog-style">
        <strong>内容 :</strong>
        <span>{{detailsObj.content}}</span>
      </div>
      <div class="dialog-style">
        <strong>紧急程度 :</strong>
        <span>{{detailsObj.emergency==0?'一般':detailsObj.emergency==1?'重要':'紧急'}}</span>
      </div>
      <div class="dialog-style">
        <strong>开始时间 :</strong>
        <span>{{detailsObj.beginTime}}</span>
      </div>
      <div class="dialog-style">
        <strong>结束时间 :</strong>
        <span>{{detailsObj.endTime}}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import "moment/locale/zh-cn";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false,
      value: new Date(),
      locale: {
        lang: {
          month: "月",
          year: "年",
        },
      },
      workList: [],
      newsList: [],
      dataList: [], //日程列表
      activeIndex: null,
      textIndex: "",
      modular: {
        isRl: false,
        isKjbg: false,
        isXwdt: false,
      },
      detailsObj: {},
    };
  },
  computed: {
    ...mapState("schedule", ["isSchedule"]),
  },
  watch: {
    isSchedule(val) {
      setTimeout(() => {
        let todaydate = new Date();
        let end_time = this.format(todaydate, "-");
        this.scheduleListData(end_time.split(" ")[0]);
      }, 2000);
    },
  },
  mounted() {
    let todaydate = new Date();
    let end_time = this.format(todaydate, "-");
    this.scheduleListData(end_time.split(" ")[0]);
    this.getList();
    this.userInfo({ id: sessionStorage.getItem("id") }).then((res) => {
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
  },
  methods: {
    removeActive() {
      this.activeIndex = null;
    },
    changeActive(title, index) {
      this.textIndex = title;
      this.activeIndex = index;
    },
    // 快捷办公跳转
    routerUrlClick(item) {
      window.location.href = item.srcUrl;
    },
    // 跳转站内消息列表
    routerStationClick() {
      this.$router.push("/information/station");
    },
    StationClick(id) {
      this.$router.push({
        path: "/information/details",
        query: {
          id,
        },
      });
    },
    // 时间补0
    supplement(nn) {
      return (nn = nn < 10 ? "0" + nn : nn);
    },
    // 转换时间格式
    format(Date, str) {
      var obj = {
        Y: Date.getFullYear(),
        M: Date.getMonth() + 1,
        D: Date.getDate(),
        H: Date.getHours(),
        Mi: Date.getMinutes(),
        S: Date.getSeconds(),
      };
      // 拼接时间 hh:mm:ss
      var time =
        " " +
        this.supplement(obj.H) +
        ":" +
        this.supplement(obj.Mi) +
        ":" +
        this.supplement(obj.S);
      // yyyy-mm-dd
      if (str.indexOf("-") > -1) {
        return (
          obj.Y +
          "-" +
          this.supplement(obj.M) +
          "-" +
          this.supplement(obj.D) +
          time
        );
      }
      // yyyy/mm/dd
      if (str.indexOf("/") > -1) {
        return (
          obj.Y +
          "/" +
          this.supplement(obj.M) +
          "/" +
          this.supplement(obj.D) +
          time
        );
      }
    },
    scheduleDetailsClick(item) {
      // this.$router.push("/schedule/mine");
      this.dialogVisible = true;
      this.scheduleDetails({ id: item.id }).then((res) => {
        this.detailsObj = res.data;
      });
    },
    scheduleListData(val) {
      this.queryTime({ time: val }).then((res) => {
        this.dataList = res.data.content.slice(0, 3);
      });
    },
    onPanelChange(value, mode) {},
    // 选择日期
    selectDataChange(val) {
      this.queryTime({ time: val.split(" ")[0] }).then((res) => {
        this.dataList = res.data.content.slice(0, 3);
      });
    },
    headerRender({ value, type, onChange, onTypeChange }) {
      const start = 0;
      const end = 12;
      const monthOptions = [];

      const current = value.clone();
      const localeData = value.localeData();
      const months = [];
      for (let i = 0; i < 12; i++) {
        current.month(i);
        months.push(localeData.monthsShort(current));
      }

      for (let index = start; index < end; index++) {
        monthOptions.push(
          <a-select-option class="month-item" key={`${index}`}>
            {months[index]}
          </a-select-option>
        );
      }
      const month = value.month();
      const year = value.year();
      const options = [];
      for (let i = year - 10; i < year + 10; i += 1) {
        options.push(
          <a-select-option key={i} value={i} class="year-item">
            {i}
          </a-select-option>
        );
      }
      return (
        <div style={{ padding: "10px" }}>
          <a-row type="flex" justify="space-between">
            <a-col>
              <span>年份：</span>
              <a-select
                size="small"
                dropdownMatchSelectWidth={false}
                class="my-year-select"
                onChange={(newYear) => {
                  const now = value.clone().year(newYear);
                  onChange(now);
                }}
                value={String(year)}
              >
                {options}
              </a-select>
            </a-col>
            <a-col>
              <span>月份：</span>
              <a-select
                size="small"
                dropdownMatchSelectWidth={false}
                value={String(month)}
                onChange={(selectedMonth) => {
                  const newValue = value.clone();
                  newValue.month(parseInt(selectedMonth, 10));
                  onChange(newValue);
                }}
              >
                {monthOptions}
              </a-select>
            </a-col>
            <a-col>
              <a-radio-group
                size="small"
                onChange={(e) => onTypeChange(e.target.value)}
                value={type}
              >
                <a-radio-button value="month">月</a-radio-button>
                <a-radio-button value="year">年</a-radio-button>
              </a-radio-group>
            </a-col>
          </a-row>
        </div>
      );
    },
    // 添加日程
    addSchedule() {
      this.$store.dispatch("schedule/scheduleFrom", { flag: true, id: "" });
    },
    getList() {
      this.article({ categoryId: "kjbg" }).then((res) => {
        if (res.code === 1) {
          this.workList = res.data.content;
        }
      });
      this.article({ categoryId: "xwdt" }).then((res) => {
        if (res.code === 1) {
          this.newsList = res.data.content.slice(0, 3);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.right-right {
  margin: 10px 10px 10px 0;
}
.dialog-style {
  width: 80%;
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  strong {
    display: block;
    width: 100px;
    text-align: right;
    margin-right: 10px;
  }
  span {
    flex: 1;
  }
}
.calendar-data {
  background: #fff;
  padding: 10px 8px;
  box-sizing: border-box;
  .schedule-list {
    height: 90px;
    overflow-y: hidden;
    .schedule-title {
      margin: 0 7px;
      width: 60px;
      @include single_line_text;
    }
    .schedule-content {
      width: 160px;
      @include single_line_text;
    }
  }
  p {
    font-size: 12px;
    display: flex;
  }
  .add-button {
    display: flex;
    justify-content: center;
    img {
      width: 20px;
      height: 20px;
    }
  }
}

.fast-office {
  background: #fff;
  margin-top: 10px;
  padding: 10px;
  box-sizing: border-box;
  .office-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    border-bottom: 1px solid #d5d5d5;
  }
  .nav-layout {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
    div {
      width: 25%;
      font-size: 12px;
      text-align: center;
      padding: 15px 0;
      .active-style-text {
        position: absolute;
        top: -34px;
        left: -13px;
        width: 120%;
        height: 40px;
        background: #fff;
        border: 1px solid #eee;
        border-radius: 5px;
        font-size: 10px;
        line-height: 14px;
        padding: 3px;
      }
      img {
        width: 20px;
      }
      span {
        display: block;
        width: 65px;
        margin: auto;
        @include single_line_text;
      }
    }
  }
  .list-content {
    padding-top: 10px;
  }
  .list-item {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
}
</style>
<style>
.ant-fullcalendar-calendar-body {
  padding: 0 !important;
}
.ant-fullcalendar-today .ant-fullcalendar-value,
.ant-fullcalendar-month-panel-current-cell .ant-fullcalendar-value {
  border-radius: 50%;
}
.ant-fullcalendar-selected-day .ant-fullcalendar-value,
.ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value {
  border-radius: 50%;
}
.ant-fullcalendar-column-header {
  line-height: 30px !important;
}
</style>
