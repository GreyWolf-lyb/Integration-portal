<template>
  <el-drawer
    :title="modalObjj"
    direction="rtl"
    v-loading="loading"
    :visible.sync="dialogFormVisible"
    :before-close="ClearTextConeten"
    custom-class="demo-drawer"
    size="45%"
    :wrapperClosable="false"
    ref="drawer"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-loading="loading">
      <el-form-item prop="name" label="系统名称:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input
          clearable
          :disabled="disabledStr"
          autocomplete="off"
          v-model="ruleForm.name"
          placeholder="请输入系统名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pic" label="系统图标:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input style="display:none;" v-model="ruleForm.pic"></el-input>
        <div v-if="ruleForm.pic">
          <el-image
            style="width: 220px; height: 220px"
            :src="ImgUrl"
            :preview-src-list="[ImgUrl]"
          ></el-image>
          <el-row
            style="text-align: center;z-index: 1; width:220px;"
          >
            <el-button type="danger" size="mini" round @click="deleteImg">
              删除
            </el-button>
          </el-row>
        </div>
        <el-upload
          class="upload-demo"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP"
          :action="fileUrl"
          :headers="header"
          :show-file-list="false"
          :before-upload="handleContentChange"
          :on-success="handleAvatarSuccess"
        >
          <el-button size="small" type="primary">
            点击上传
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item
        prop="srcUrl"
        label="系统路径:"
        :label-width="this.formLabelWidth"
        class="InpitWidth"
      >
        <el-input
          clearable
          :disabled="ProhibitFromm"
          autocomplete="off"
          v-model="ruleForm.srcUrl"
          placeholder="请输入系统路径"
        ></el-input>
      </el-form-item>
      <el-form-item label="系统描述:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input
          type="textarea"
          clearable
          :disabled="ProhibitFrom"
          autocomplete="off"
          v-model="ruleForm.remark"
          placeholder="请输入系统描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="demo-drawer__footer drawer_footer">
      <el-button @click="CloseModal">取 消</el-button>
      <el-button v-if="!ProhibitFrom" type="primary" @click="SuretoAddClick('ruleForm')">确 定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { insert, update, roleList, findById } from "@/api/application/register";
import { isMPStrict } from "@/utils/validate";
export default {
  components: {
    // 注册组件
    // editor: editor
  },

  props: {
    modalObjj: {
      type: String,
      default: () => {}
    }
  },

  data() {
    return {
      disabledStr: false,
      ImgUrl: '',
      ruleForm: {
        name: "",
        pic: "",
        srcUrl: "",
        remark: ""
      },
      obj: {},
      rule: {},
      options: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入系统名称",
            trigger: "blur"
          }
        ],
        pic: [
          {
            required: true,
            trigger: ["change", "blur"],
            message: "请上传图标"
          }
        ],
        srcUrl: [
          {
            required: true,
            message: "请输入系统路径",
            trigger: "blur"
          },
          {
            pattern: /(http|https):\/\/([\w.]+\/?)\S*/, //正则
            message: "请输入正确的系统路径"
          }
        ]
      },
      fileUrl: process.env.VUE_APP_BASE_API + "service/base/file/uploadFile",
      header: {
        Authorization: "token " + localStorage.getItem("token")
      },
      // 是否触发禁用表单项
      ProhibitFrom: false,
      ProhibitFromm: false,
      dialogFormVisible: this.show,
      formLabelWidth: "120px",
      lock: false,
      dialogVisible: true,
      loading: false
    };
  },
  watch: {
    show() {
      this.dialogFormVisible = this.show;
    }
  },
  methods: {
    // 删除照片
    deleteImg() {
      this.ruleForm.pic = "";
      this.ImgUrl = "";
    },
    handleContentChange(file) {
      let that = this;
      let FileSize = file.size / 1024 / 1024 < 500;
      if (!FileSize) {
        that.$message.error("上传超出文件限制大小");
        return false;
      }
      this.isSubmitLoading = true;
    },
    handleAvatarSuccess(response, file, fileList) {
      let that = this;
      if (response.code === 1) {
        that.ImgUrl = response.data.fileLongPath;
        that.ruleForm.pic = response.data.filePath;
        that.$message.success(response.msg);
        return false;
      }
    },
    initial: function(value) {
      const that = this;
      that.dialogFormVisible = true;

      if (value) {
        that.nowId = value;
        that.initFormDetail(value);
      } else {
        that.ProhibitFrom = false;
      }
    },
    async initFormDetail(value) {
      const that = this;
      try {
        let parameter = { id: value };
        that.loading = true;
        const response = await findById(parameter);
        that.loading = false;
        that.ImgUrl = process.env.VUE_APP_URL_API + response.data.data.pic
        that.ruleForm = response.data.data;
        if (this.modalObjj === "详情") {
          that.ProhibitFrom = true;
          // 禁用编辑器
        } else if (this.modalObjj === "编辑") {
          that.ProhibitFromm = false;
          // that.disabledStr = true;
          that.lock = true;
        } else {
          that.lock = false;
          that.ProhibitFrom = false;
          that.ProhibitFromm = false;
        }
      } catch (even) {
        that.$message.error("数据获取失败");
      }
    },

    // 关闭模态框 清空所有表单项 为编辑器初始化
    CloseModal() {
      const that = this;
      that.ClearTextConeten();
      that.ProhibitFrom = false;
    },

    // 初始化表单
    ClearTextConeten() {
      const that = this;
      that.$refs["ruleForm"].resetFields();
      that.ImgUrl = "";
      that.ruleForm.name = "";
      that.ruleForm.pic = "";
      that.ruleForm.remark = "";
      that.ruleForm.srcUrl = "";

      // that.ruleForm.sex = "";
      that.ProhibitFrom = false;
      that.ProhibitFromm = false;
      that.dialogFormVisible = false;
      if (that.ruleForm.id) {
        delete that.ruleForm.id;
      }
    },

    SuretoAddClick(ruleForm) {
      console.log(ruleForm, "ruleForm");
      const that = this;

      that.$refs[ruleForm].validate(index => {
        if (index === false) {
          return false;
        }
        if (this.modalObjj === "添加") {
          Object.entries(that.ruleForm).map((a, b) => {
            if (a[0] === "id") {
              delete that.ruleForm[a[0]];
            }
          });
          that.add(that.ruleForm);
          return false;
        } else if (this.modalObjj === "编辑") {
          var data = {
            name: that.ruleForm.name,
            pic: that.ruleForm.pic,
            srcUrl: that.ruleForm.srcUrl,
            remark: that.ruleForm.remark,
            id: that.ruleForm.id
          };
          console.log(that.ruleForm, "that.ruleForm");
          that.edit(data);
          return false;
        }
      });
    },

    // 添加方法
    async add(data) {
      const that = this;
      // POST请求添加轮播图数据
      let da = data;
      da.roleName = that.obj.label;
      that.loading = true;
      const response = await insert(da);
      that.loading = false;
      if (response.data.code === 1) {
        // 添加成功后 回调效果
        that.$message.success(response.data.msg);
        /**
         * 清空表单元素 重置验证信息.
         * @param imageUrl
         * @param detail
         */
        that.ClearTextConeten();
        // 重新触发父组件加载loading
        that.$emit("Reload");
      } else {
        // 添加上传失败后 回调失败信息
        that.$message.error(response.data.msg);
        return false;
      }
    },

    // 修改方法
    async edit(data) {
      const that = this;
      // PUT 请求修改数据
      that.loading = true;
      const response = await update(data);
      that.loading = false;
      if (response.data.code === 1) {
        // 添加成功后 回调效果
        that.$message.success(response.data.msg);
        /**
         * 清空表单元素 重置验证信息.
         * @param imageUrl
         * @param detail
         */
        that.ClearTextConeten();
        // 重新触发父组件加载loading
        that.$emit("Reload");
      } else {
        // 添加上传失败后 回调失败信息
        that.$message.error(response.data.msg);
        return false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/drawer.scss";
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
