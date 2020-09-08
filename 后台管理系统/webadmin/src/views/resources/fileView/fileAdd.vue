<template>
  <el-drawer
    :title="title"
    direction="rtl"
    v-loading="loading"
    :visible.sync="dialogFormVisible"
    :before-close="ClearTextConeten"
    custom-class="demo-drawer"
    size="45%"
    :wrapperClosable="false"
    ref="drawer"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item
        prop="folderName"
        label="文件夹名称:"
        :label-width="this.formLabelWidth"
        class="InpitWidth"
      >
        <el-input
          clearable
          autocomplete="off"
          v-model="ruleForm.folderName"
          placeholder="请输入文件夹名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="demo-drawer__footer drawer_footer">
      <el-button @click="ClearTextConeten">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import { addFile, fileDetails, fileNameEdit } from "@/api/resources";
export default {
  props: {
    title: {
      type: String,
      default: () => {},
    },
  },

  data() {
    return {
      id: "",
      ruleForm: {
        folderName: "",
      },
      rules: {
        folderName: [
          {
            required: true,
            message: "请输入文件夹名称",
            trigger: "blur",
          },
        ],
      },
      dialogFormVisible: this.show,
      formLabelWidth: "120px",
      loading: false,
    };
  },
  watch: {
    show() {
      this.dialogFormVisible = this.show;
    },
  },
  methods: {
    initial: function (value) {
      const that = this;
      that.dialogFormVisible = true;
      if (value) {
        that.id = value;
        that.initFormDetail();
      }
    },
    async initFormDetail() {
      const that = this;
      try {
        let parameter = { id: that.id };
        that.loading = true;
        const response = await fileDetails(parameter);
        that.loading = false;
        that.ruleForm = response.data.data;
      } catch (even) {
        that.$message.error("数据获取失败");
      }
    },

    // 初始化表单
    ClearTextConeten() {
      const that = this;
      that.$refs["ruleForm"].resetFields();
      that.id = "";
      this.ruleForm.folderName = "";
      that.dialogFormVisible = false;
    },

    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {
            folderName: this.ruleForm.folderName,
          };
          let response = null;
          if (this.id) {
            data.id = this.id;
            response = await fileNameEdit(data);
          } else {
            response = await addFile(data);
          }
          if (response.data.code === 1) {
            this.$message.success(response.data.msg);
            this.ClearTextConeten();
            this.$emit("Reload");
            return false;
          }
          this.$message.error(response.data.msg);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.el-drawer {
  .el-drawer {
    .el-drawer__body {
      padding: 10px 20px !important;
    }
  }
  .InpitWidth {
    width: 80%;
    min-width: 302px;
  }
  .avatar-border-red .el-upload {
    border: 1px dashed #f56c6c !important;
    border-radius: 6px;
    cursor: pointer;
    float: left;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #b6b5b5;
    }
    .el-progress {
      position: absolute;
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      .el-progress-circle {
        margin: 13% auto 10%;
      }
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    float: left;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #b6b5b5;
    }
    .el-progress {
      position: absolute;
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      .el-progress-circle {
        margin: 13% auto 10%;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
  }
  .avatar {
    width: 200px;
    height: 180px;
    display: block;
  }
}

.edit_main {
  text-align: left;
  padding: 10px 15px;
  border-radius: 5px;
  min-height: 250px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  img {
    width: auto;
    height: auto;
  }
}

.ClassDisable .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  float: left;
  position: relative;
  overflow: hidden;
  cursor: no-drop;
  &:hover {
    border-color: #b6b5b5;
  }
  .el-progress {
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    .el-progress-circle {
      margin: 13% auto 10%;
    }
  }
}

.buttonentry {
  float: left;
  text-align: left;
}
.a {
  width: 6vw !important;
}
.drawer_footer {
  text-align: center;
}
:focus {
  outline: 0;
}
</style>
