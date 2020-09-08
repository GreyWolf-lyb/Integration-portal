<template>
  <div class="change-password">
    <h2>修改密码</h2>
    <div class="from-style">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="used">
          <el-input type="password" v-model.number="ruleForm.used" placeholder="请输入旧密码" clearable></el-input>
          <el-input style="position:fixed;bottom:-999px;"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码" clearable></el-input>
          <el-input style="position:fixed;bottom:-999px;"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" placeholder="请输入确认密码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="提示"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>密码修改成功，请从新登录...</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="determineClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      ruleForm: {
        pass: "",
        checkPass: "",
        used: "",
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "", trigger: "blur" },
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur" },
          { required: true, message: "", trigger: "blur" },
        ],
        used: [
          { validator: checkAge, trigger: "blur" },
          { required: true, message: "", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    determineClick() {
      this.dialogVisible = false;
      sessionStorage.clear();
      window.location.href =
        // "http://10.15.1.41:9001/auth/realms/share/protocol/openid-connect/logout?redirect_uri=http://10.15.1.20/integration_manage";
      "http://106.116.160.122:9001/auth/realms/share/protocol/openid-connect/logout?redirect_uri=http://106.116.160.122:8081/integration_manage";
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            newPassword: String(this.ruleForm.checkPass),
            oldPassword: String(this.ruleForm.used),
          };
          this.passeordEdit(data).then((res) => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.dialogVisible = true;
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.change-password {
  background: #fff;
  margin: 8px 15px;
  box-sizing: border-box;
  h2 {
    line-height: 52px;
    border-bottom: 1px solid #d5d5d5;
    padding-left: 10px;
  }
  .from-style {
    width: 450px;
    margin: auto;
    padding: 50px 0;
  }
}
</style>
<style>
.el-button--small,
.el-button--small.is-round {
  padding: 9px 45px;
}
.el-form-item__content {
  display: flex;
  justify-content: center;
}
.el-form-item--feedback .el-input__validateIcon {
  display: none !important;
}
</style>
