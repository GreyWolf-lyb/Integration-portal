<template>
  <div class="schedule-from">
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="close"
    >
      <div v-if="dialogFormVisible" class="dialog-schedule">
        <el-form :model="form" :rules="rules" ref="form" label-position="right">
          <el-form-item label="标题:" :label-width="formLabelWidth" prop="title">
            <div class="from-style">
              <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="内容:" :label-width="formLabelWidth">
            <div class="from-style">
              <el-input
                type="textarea"
                v-model="form.content"
                placeholder="请输入内容"
                autocomplete="off"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="紧急程度:" :label-width="formLabelWidth" prop="value">
            <el-select v-model="form.value" placeholder="请选择紧急程度">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间:" :label-width="formLabelWidth" prop="startTime">
            <el-date-picker
              class="data-picker-time"
              ref="datePoint"
              v-model="form.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始时间"
              :picker-options="{
                disabledDate: (time) => {
                  return dataTime.startTimeData(time)
                },
                selectableRange: this.startTimeRange
              }"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:" :label-width="formLabelWidth" prop="endTime">
            <el-date-picker
              class="data-picker-time"
              v-model="form.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束时间"
              :picker-options="{
                disabledDate: (time) => {
                  return dataTime.endTimeData(time)
                },
                selectableRange: this.endTimeRange
              }"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="提醒方式:" :label-width="formLabelWidth">
            <el-checkbox-group v-model="form.checkList">
              <el-checkbox label="0">短信提醒</el-checkbox>
              <el-checkbox label="1">邮件提醒</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="开始前提醒:" :label-width="formLabelWidth">
            <div class="remind-style">
              <el-input v-model="form.remind" placeholder="请输入提醒时间" autocomplete="off"></el-input>
              <span>分钟</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      title: "新建日程",
      dialogFormVisible: false,
      editId: "",
      form: {
        title: "",
        content: "",
        value: "",
        startTime: "",
        endTime: "",
        checkList: [],
        remind: "",
      },
      startTimeRange: null,
      endTimeRange: null,
      formLabelWidth: "90px",
      options: [
        {
          value: "0",
          label: "一般",
        },
        {
          value: "1",
          label: "重要",
        },
        {
          value: "2",
          label: "紧急",
        },
      ],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        value: [
          { required: true, message: "请选择紧急程度", trigger: "change" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
      },
      // 限制开始日期不能大于结束日期
      dataTime: {
        // 开始时间范围限制
        startTimeData: (time) => {
          if (this.form.endTime != "") {
            return (
              time.getTime() < Date.now() - 8.64e7 ||
              time.getTime() > new Date(this.form.endTime)
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        // 结束时间范围限制
        endTimeData: (time) => {
          if (
            this.form.startTime != "" &&
            this.form.startTime.split(" ")[1] != "00:00:00"
          ) {
            return time.getTime() < new Date(this.form.startTime) - 8.64e7;
          } else {
            return (
              time.getTime() < new Date() - 8.64e7 ||
              time.getTime() < new Date(this.form.startTime)
            );
          }
        },
      },
    };
  },
  computed: {
    ...mapState("schedule", ["id", "isSchedule"]),
  },
  watch: {
    "form.startTime": {
      handler(newValue, oldValue) {
        if (newValue) {
          let nowDate = this.format(new Date(), "-");
          let dt = nowDate.split(" ");
          let st = "";
          if (newValue.split(" ")[0] == dt[0]) {
            // 是今天,选择 的时间开始为此刻的时分秒
            st = dt[1];
          } else {
            // 明天及以后从0时开始
            st = "00:00:00";
          }
          this.startTimeRange = st + " - 23:59:59";
          //例如：如果今天此刻时间为10:41:40 则选择时间范围为： 10:41:40 - 23:59:59
          //否则为：00:00:00- 23:59:59
        }
      },
    },
    "form.endTime": {
      handler(newValue, oldValue) {
        if (newValue) {
          let zt = this.form.startTime.split(" "); //开始日期
          let st = "";
          if (newValue.split(" ")[0] == zt[0]) {
            st = zt[1];
          } else {
            st = "00:00:00";
          }
          this.endTimeRange = st + " - 23:59:59";
        }
      },
    },
    isSchedule(curVal, oldVal) {
      //这里的curVal就是需要监听的值
      this.dialogFormVisible = curVal;
      if (!curVal) {
        this.form.title = "";
        this.form.content = "";
        this.form.value = "";
        this.form.startTime = "";
        this.form.endTime = "";
        this.form.checkList = [];
        this.form.remind = "";
      }
    },
    id(id) {
      this.editId = id;
      if (this.editId) {
        this.title = "编辑日程";
        this.exhibitionFun(this.editId);
      } else if (this.editId === "") {
        this.title = "新建日程";
      }
    },
  },
  methods: {
    exhibitionFun(id) {
      this.scheduleDetails({ id }).then((res) => {
        this.form.title = res.data.title;
        this.form.content = res.data.content;
        this.form.value = res.data.emergency;
        this.form.startTime = res.data.beginTime;
        this.form.endTime = res.data.endTime;
        this.form.checkList =
          res.data.remindWay < 2 ? [res.data.remindWay] : ["0", "1"];
        this.form.remind = res.data.startMinute;
      });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            id: this.editId,
            remindWay:
              this.form.checkList.length < 2 ? this.form.checkList[0] : "2",
            startMinute: this.form.remind,
            title: this.form.title,
            beginTime: this.form.startTime,
            content: this.form.content,
            emergency: this.form.value,
            endTime: this.form.endTime,
          };
          if (this.editId) {
            this.scheduleEdit(data).then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
              });
            });
          } else {
            this.scheduleAdd(data).then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
              });
            });
          }
          this.$store.dispatch("schedule/scheduleFrom", {
            flag: false,
            id: "",
          });
        } else {
          return false;
        }
      });
    },
    close() {
      this.$store.dispatch("schedule/scheduleFrom", {
        flag: false,
        id: "",
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
  },
};
</script>
<style lang="scss" scope>
.schedule-from {
  .dialog-schedule {
    margin-left: 50px;
    .el-form-item {
      margin-bottom: 12px !important;
    }
  }
  .el-dialog {
    width: 40% !important;
  }
  .from-style {
    width: 80%;
  }
  .remind-style {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    span {
      width: 50px;
      margin-left: 10px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
<style>
.el-select {
  width: 80%;
}
.schedule-from .dialog-schedule .el-form-item {
  margin-bottom: 20px !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 80% !important;
}
.data-picker-time input {
  width: 80% !important;
}
</style>
