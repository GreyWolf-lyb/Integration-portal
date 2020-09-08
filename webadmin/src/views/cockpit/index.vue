<template>
  <div class="cockpit-page">
    <div v-if="modular.isCpu||modular.isNc||modular.isWl" class="select-server">
      <span style="margin-right:10px">服务器 :</span>
      <div style="width:150px;">
        <el-select v-model="value" @change="changeClick" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>
    <div v-if="modular.isCpu||modular.isNc||modular.isWl" class="utilization-rate">
      <div v-if="modular.isCpu" class="item-Utilization">
        <div class="data-Utilization">
          <div ref="myChartOne" id="myChartOne" :style="{width: '100px', height: '100px'}"></div>
        </div>
        <h2>CPU利用率</h2>
        <p>{{currentTime}}</p>
      </div>
      <div v-if="modular.isNc" class="item-Utilization">
        <div class="data-Utilization">
          <div ref="myChartTwo" id="myChartTwo" :style="{width: '100px', height: '100px'}"></div>
        </div>
        <h2>内存利用率</h2>
        <p>{{currentTime}}</p>
      </div>
      <div v-if="modular.isWl" class="item-Utilization">
        <div class="data-Utilization">
          <div ref="myChartThree" id="myChartThree" :style="{width: '100px', height: '100px'}"></div>
        </div>
        <h2>物理机磁盘利用率</h2>
        <p>{{currentTime}}</p>
      </div>
    </div>
    <div v-if="modular.isJr||modular.isQr||modular.isSsr" class="total-exhibition">
      <div v-if="modular.isJr" class="tatal-item">
        <div class="item-left">
          <p>合计</p>
          <span>{{now}}人</span>
        </div>
        <div class="item-right">
          <p>今日</p>
          <p>累计活跃用户数</p>
          <span>{{currentTime.split(' ')[0]}}</span>
        </div>
      </div>
      <div v-if="modular.isQr" class="tatal-item">
        <div class="item-left">
          <p>合计</p>
          <span>{{sevenDay}}人</span>
        </div>
        <div class="item-right">
          <p>7日</p>
          <p>累计活跃用户数</p>
          <span>{{sevenTime[0]}} - {{sevenTime[1]}}</span>
        </div>
      </div>
      <div v-if="modular.isSsr" class="tatal-item">
        <div class="item-left">
          <p>合计</p>
          <span>{{month}}人</span>
        </div>
        <div class="item-right">
          <p>30日</p>
          <p>累计活跃用户数</p>
          <span>{{thirtyTime[1]}} - {{thirtyTime[0]}}</span>
        </div>
      </div>
    </div>
    <div v-if="modular.isFwl||modular.isZxrs||modular.isSlpm||modular.isWcqk" class="data-echarts">
      <div class="echarts-header">
        <h2>数据概览</h2>
        <div style="width:370px">
          <el-date-picker
            v-model="valueTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeData"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </div>
      <div class="echarts-content">
        <div v-if="modular.isFwl" class="echarts-item">
          <div class="echarts-time">{{echartsTime}}</div>
          <div ref="myChart" id="myChart" :style="{width: '500px', height: '300px'}"></div>
        </div>
        <div v-if="modular.isZxrs" class="echarts-item">
          <div class="echarts-time">{{echartsTime}}</div>
          <div ref="myChart1" id="myChart1" :style="{width: '500px', height: '300px'}"></div>
        </div>
        <div v-if="modular.isSlpm" class="echarts-item">
          <div class="echarts-time">{{echartsTime}}</div>
          <div ref="myChart2" id="myChart2" :style="{width: '430px', height: '300px'}"></div>
        </div>
        <div v-if="modular.isWcqk" class="echarts-item">
          <div class="echarts-time">{{echartsTime}}</div>
          <div ref="myChart3" id="myChart3" :style="{width: '500px', height: '300px'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "echarts-liquidfill";
export default {
  data() {
    return {
      valueTime: [],
      cpuData: "",
      memory: "",
      diskData: "",
      month: "",
      now: "",
      sevenDay: "",
      echartsTime: "",
      options: [],
      value: "",
      currentTime: "", //当前时间
      sevenTime: "", //一周内时间
      thirtyTime: "", //30天时间
      minDate: "",
      maxDate: "",
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.minDate = minDate;
          this.maxDate = maxDate;
        },
        disabledDate: (time) => {
          //查询时间跨度为7天
          if (this.minDate) {
            let range = 7 * 24 * 3600 * 1000;
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.minDate.getTime() + range ||
              time.getTime() < this.minDate.getTime() - range
            );
          }
          return time.getTime() > Date.now();
        },
      },
      modular: {
        isCpu: false,
        isNc: false,
        isWl: false,
        isJr: false,
        isQr: false,
        isSsr: false,
        isFwl: false,
        isZxrs: false,
        isSlpm: false,
        isWcqk: false,
      },
    };
  },
  mounted() {
    this.isFlagModule();
    let todaydate = new Date();
    // 当前时间
    this.currentTime = this.format(todaydate, "-");
    this.sevenTime = this.fundate(-7);
    this.valueTime = this.sevenTime.reverse();
    this.thirtyTime = this.fundate(-30);
  },
  methods: {
    // 判断模块显示隐藏
    isFlagModule() {
      this.userInfo({ id: sessionStorage.getItem("id") }).then((res) => {
        let mod = JSON.parse(res.data.module);
        if (mod.cockpitMemory.indexOf("cpu") > -1) {
          this.modular.isCpu = true;
        }
        if (mod.cockpitMemory.indexOf("内存") > -1) {
          this.modular.isNc = true;
        }
        if (mod.cockpitMemory.indexOf("物理磁盘") > -1) {
          this.modular.isWl = true;
        }
        if (mod.timeArr.indexOf("今日") > -1) {
          this.modular.isJr = true;
        }
        if (mod.timeArr.indexOf("7日") > -1) {
          this.modular.isQr = true;
        }
        if (mod.timeArr.indexOf("30日") > -1) {
          this.modular.isSsr = true;
        }
        if (mod.numberArr.indexOf("系统访问量") > -1) {
          this.modular.isFwl = true;
        }
        if (mod.numberArr.indexOf("系统在线人数") > -1) {
          this.modular.isZxrs = true;
        }
        if (mod.numberArr.indexOf("待办数量排名") > -1) {
          this.modular.isSlpm = true;
        }
        if (mod.numberArr.indexOf("待阅任务完成情况") > -1) {
          this.modular.isWcqk = true;
        }
        this.CrystalBall();
        let time = this.fundate(-7);
        // 初始数据获取一周数据
        this.echartsTime = time[1] + "-" + time[0];
        this.echartsData({ startTime: time[1], endTime: time[0] });
      });
    },
    // 水晶球和活跃量默认数据
    CrystalBall() {
      let that = this;
      this.findAllNodes().then((res) => {
        this.options = res.data;
        this.value = res.data[0].name;
        this.initialData(res.data[0].id);
      });
      this.findUserActive().then((res) => {
        this.month = res.data.thirty;
        this.now = res.data.now;
        this.sevenDay = res.data.seven;
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
    // 一周内时间
    fundate(num) {
      var date1 = new Date();
      //今天时间
      var time1 =
        date1.getFullYear() +
        "-" +
        // (date1.getMonth() + 1) +
        this.supplement(date1.getMonth() + 1) +
        "-" +
        date1.getDate();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + num);
      //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
      var time2 =
        date2.getFullYear() +
        "-" +
        // (date2.getMonth() + 1) +
        this.supplement(date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      return [time1, time2];
    },
    changeClick(val) {
      this.initialData(val);
    },
    // 水晶球
    initialData(nodeId = null) {
      this.findSystemInfo({ nodeId }).then((res) => {
        let obj = res.data.configuration
          ? JSON.parse(res.data.configuration)
          : { ram: 0, rom: 0 };
        let data = 100 - res.data.cpu;
        let data1 = Math.round((res.data.ram / obj.ram) * 100);
        let data2 = Math.round((res.data.rom / obj.rom) * 100);
        this.cpuData = data;
        this.memory = data1;
        this.diskData = data2;

        if (this.modular.isCpu) {
          this.ChartsOne();
        }
        if (this.modular.isNc) {
          this.ChartsTwo();
        }
        if (this.modular.isWl) {
          this.ChartsThree();
        }
      });
    },
    echartsData(data) {
      let that = this;
      // 待阅任务完成情况
      this.findTaskState(data).then((res) => {
        this.echartsFour(res.data);
      });
      // 待办数量排名
      this.findTaskTop(data).then((res) => {
        this.echartsThree(res.data);
      });
      // // 系统在线人数
      this.getLoginNum(data).then((res) => {
        this.echartsTwo(res.data);
      });
      // // 系统访问量
      this.getSystemVisit(data).then((res) => {
        this.echartsOne(res.data);
      });
    },
    // 查询日期
    changeData(val) {
      this.echartsTime =
        val[0].replace(/-/g, ".") + "-" + val[1].replace(/-/g, ".");
      this.echartsData({ startTime: val[0], endTime: val[1] });
    },
    // 第一个水晶球
    ChartsOne() {
      let myChart = this.$echarts.init(this.$refs.myChartOne);
      var str = this.cpuData / 100;
      myChart.setOption({
        series: [
          {
            type: "liquidFill",
            radius: "80%",
            center: ["50%", "50%"],
            data: [str],
            backgroundStyle: {
              color: "#fff",
            },
            outline: {
              borderDistance: 3,
              itemStyle: {
                borderWidth: 1,
                borderColor: "#5ABD8C",
                shadowBlur: 0,
              },
            },
            color: ["#5ABD8C"],
            label: {
              normal: {
                formatter: this.cpuData,
                textStyle: {
                  fontSize: 14,
                  color: "#fff",
                  textBorderColor: "#5ABD8C",
                  textBorderWidth: 1,
                },
              },
            },
          },
        ],
      });
    },
    ChartsTwo() {
      let myChart = this.$echarts.init(this.$refs.myChartTwo);
      var str = this.memory / 100;
      myChart.setOption({
        series: [
          {
            type: "liquidFill",
            radius: "80%",
            center: ["50%", "50%"],
            data: [str],
            backgroundStyle: {
              color: "#fff",
            },
            outline: {
              borderDistance: 3,
              itemStyle: {
                borderWidth: 1,
                borderColor: "#5ABD8C",
                shadowBlur: 0,
              },
            },
            color: ["#5ABD8C"],
            label: {
              normal: {
                formatter: this.memory,
                textStyle: {
                  fontSize: 14,
                  color: "#fff",
                  //  fontWeight: 600,
                  textBorderColor: "#5ABD8C",
                  textBorderWidth: 1,
                },
              },
            },
          },
        ],
      });
    },
    ChartsThree() {
      let myChart = this.$echarts.init(this.$refs.myChartThree);
      var str = this.diskData / 100;
      myChart.setOption({
        series: [
          {
            type: "liquidFill",
            radius: "80%",
            center: ["50%", "50%"],
            data: [str],
            backgroundStyle: {
              color: "#fff",
            },
            outline: {
              borderDistance: 3,
              itemStyle: {
                borderWidth: 1,
                borderColor: "#5ABD8C",
                shadowBlur: 0,
              },
            },
            color: ["#5ABD8C"],
            label: {
              normal: {
                formatter: this.diskData,
                textStyle: {
                  fontSize: 14,
                  color: "#fff",
                  //  fontWeight: 600,
                  textBorderColor: "#5ABD8C",
                  textBorderWidth: 1,
                },
              },
            },
          },
        ],
      });
    },
    // 第一个图表
    echartsOne(data) {
      let myChart = this.$echarts.init(this.$refs.myChart);
      myChart.setOption({
        title: {
          text: "系统访问量",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          //字体倾斜
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "#343434",
            },
            fontSize: "8",
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: data.name,
        },
        yAxis: {
          name: "单位（次）",
          type: "value",
          splitNumber: 4, // X轴计算倍数
          offset: 20, //文字距离刻度周距离
          axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: "#5ABD8C", //改变折线点的颜色
                lineStyle: {
                  color: "#5ABD8C", //改变折线颜色
                },
              },
            },
            // 渲染数据
            data: data.num,
            type: "line",
          },
        ],
      });
    },
    echartsTwo(data) {
      let myChart = this.$echarts.init(this.$refs.myChart1);
      myChart.setOption({
        title: {
          text: "系统在线人数",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          //字体倾斜
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "#343434",
            },
            fontSize: "10",
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: data.name,
        },
        yAxis: {
          name: "单位（人）",
          type: "value",
          splitNumber: 4, // X轴计算倍数
          offset: 20, //文字距离刻度周距离
          axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: "#5ABD8C", //改变折线点的颜色
                lineStyle: {
                  color: "#5ABD8C", //改变折线颜色
                },
              },
            },
            // 渲染数据
            data: data.num,
            type: "line",
          },
        ],
      });
    },
    echartsThree(data) {
      let name = [],
        num = [];
      data.map((item) => {
        name.push(item.handler);
        num.push(item.num);
      });
      let myChart = this.$echarts.init(this.$refs.myChart2);
      myChart.setOption({
        title: {
          text: "待办数量排名（TOP10）",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          name: "(数量)",
          nameTextStyle: {
            padding: [0, 20, -20, -5], // 四个数字分别为上右下左与原位置距离
          },
          type: "value",
          splitNumber: 5, // X轴计算倍数
          axisLabel: {
            textStyle: {
              color: "#343434",
            },
            fontSize: "10",
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        grid: {
          //距离
          left: "2%",
          containLabel: true, //保留文字距离
        },
        yAxis: {
          type: "category",
          offset: -5, //文字距离刻度周距离
          axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
          data: name,
        },
        series: [
          {
            type: "bar",
            barWidth: 8, //柱图宽度
            itemStyle: {
              // 柱状图颜色
              normal: {
                color: "#5ABD8C",
                label: {
                  show: true,
                  position: "right",
                  textStyle: {
                    color: "#343434",
                  },
                },
              },
            },
            data: num,
          },
        ],
      });
    },
    echartsFour(data) {
      let time = [],
        unread = [],
        read = [];
      data.reverse().map((item) => {
        time.push(item.date);
        unread.push(item.unread);
        read.push(item.read);
      });
      let myChart = this.$echarts.init(this.$refs.myChart3);
      myChart.setOption({
        title: {
          text: "待阅任务完成情况",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          orient: "horizontal",
          x: "center",
          y: "283px",
          width: "300",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#343434",
          },
          data: ["已阅任务", "待阅任务"],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              interval: 0,
              rotate: 35,
              show: true,
              textStyle: {
                color: "#343434", //更改坐标轴文字颜色
                fontSize: 10, //更改坐标轴文字大小
              },
            },
            axisLine: {
              //y轴
              show: false,
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            data: time,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              //y轴
              show: false,
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
          },
        ],
        series: [
          {
            name: "已阅任务",
            type: "bar",
            barWidth: 15, //柱图宽度
            itemStyle: {
              // 柱状图颜色
              normal: {
                color: "#5ABD8C",
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#343434",
                  },
                },
              },
            },
            data: read,
            barGap: 0,
          },
          {
            name: "待阅任务",
            type: "bar",
            barWidth: 15, //柱图宽度
            itemStyle: {
              // 柱状图颜色
              normal: {
                color: "#15253A",
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "##343434",
                  },
                },
              },
            },
            data: unread,
            barGap: 0,
          },
        ],
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.cockpit-page {
  .select-server {
    padding-right: 20px;
    height: 50px;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  p,
  h2 {
    margin: 0;
  }
  padding: 10px;
  .utilization-rate {
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    .item-Utilization {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
      box-sizing: border-box;
      // .data-Utilization {
      //   width: 50px;
      //   height: 50px;
      //   border: 1px solid #5abd8c;
      //   border-radius: 50%;
      // }
    }
  }
  .total-exhibition {
    margin-top: 10px;
    display: flex;
    .tatal-item {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      margin-right: 10px;
      padding: 10px;
      box-sizing: border-box;
      &:nth-child(3) {
        margin: 0;
      }
      .item-left {
        font-size: 17px;
        span {
          color: #5abd8c;
        }
      }
      .item-right {
        margin-right: 30px;
        p {
          color: #343434;
          font-size: 17px;
        }
        span {
          font-size: 12px;
          color: #555555;
        }
      }
    }
  }
  .data-echarts {
    background: #fff;
    margin-top: 10px;
    .echarts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #d5d5d5;
      h2 {
        font-size: 16px;
      }
    }
    .echarts-content {
      display: flex;
      flex-wrap: wrap;
      padding: 15px;
      box-sizing: border-box;
      .echarts-item {
        width: 49%;
        border: 1px solid #d5d5d5;
        padding: 20px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        margin-bottom: 15px;
        &:nth-child(1),
        &:nth-child(3) {
          margin-right: 15px;
        }
        .echarts-time {
          position: absolute;
          right: 20px;
        }
      }
    }
  }
}
</style>
<style>
.el-input__icon {
  line-height: 20px;
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 300px;
}
.el-input__inner {
  height: 30px;
}
.el-date-editor .el-range__icon {
  line-height: 22px !important;
}
.el-date-editor .el-range-separator {
  line-height: 22px !important;
  width: 10% !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
.el-date-editor .el-range__close-icon {
  line-height: 24px;
}
</style>