<template>
  <div class="personal-information">
    <h2>个人信息</h2>
    <div class="information-from">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="头像:">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :http-request="upLoad"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名:" prop="name">
          <el-input disabled v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio-group v-model="ruleForm.age">
            <el-radio label="1">女</el-radio>
            <el-radio label="0">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位:">
          <el-input v-model="ruleForm.position"></el-input>
        </el-form-item>
        <el-form-item label="职务:">
          <el-input v-model="ruleForm.duties"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: "",
      ruleForm: {
        name: "",
        phone: "",
        email: "",
        age: "",
        position: "",
        duties: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "手机号格式不对",
            trigger: ["blur"],
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"],
          },
        ],
      },
    };
  },
  mounted() {
    this.userInfoData();
  },
  methods: {
    // 用户信息
    userInfoData() {
      this.userInfo({ id: sessionStorage.getItem("id") }).then((res) => {
        this.imageUrl = res.data.icon;
        this.ruleForm.name = res.data.name;
        this.ruleForm.phone = res.data.tel;
        this.ruleForm.email = res.data.email;
        this.ruleForm.age = res.data.sex;
        this.ruleForm.position = res.data.job;
        this.ruleForm.duties = res.data.duty;
      });
    },
    // 提交修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            icon: this.imageUrl,
            duty: this.ruleForm.duties,
            email: this.ruleForm.email,
            job: this.ruleForm.position,
            sex: this.ruleForm.age,
            tel: this.ruleForm.phone,
          };
          this.userEdit(data).then((res) => {
            this.$message({
              message: res.msg,
              type: "success",
            });
          });
        } else {
          return false;
        }
      });
    },
    // 上传头像
    upLoad(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      this.uploadFile(formData).then((res) => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.imageUrl = res.data.fileLongPath; // 请求之后将返回的URL给修改的接口在进行一次修改请求
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
  },
};
</script>
<style lang="scss" scoped>
.personal-information {
  background: #fff;
  margin: 8px 15px;
  h2 {
    line-height: 52px;
    border-bottom: 1px solid #d5d5d5;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .information-from {
    width: 400px;
    margin: auto;
    padding: 30px 0;
    box-sizing: border-box;
  }
}
</style>
<style>
.el-form-item__content {
  display: flex;
  justify-content: flex-start !important;
}
.avatar-uploader-icon {
  height: 64px;
}
.avatar-uploader .el-upload {
  border: 1px solid #d9d9d9;
  /* border-radius: 6px; */
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 75px;
  height: 75px;
  line-height: 75px !important;
  text-align: center;
}
.avatar {
  width: 75px;
  height: 75px;
  display: block;
}
.el-button {
  width: 100px;
}
</style>

