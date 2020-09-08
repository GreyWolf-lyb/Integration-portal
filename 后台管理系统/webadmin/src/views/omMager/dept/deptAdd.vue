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
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
      <el-row class='el-row-el'>
        <el-col :span="24">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入部门名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="demo-drawer__footer drawer_footer">
      <el-button @click="ClearTextConeten">取 消</el-button>
      <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { findById, update, insert } from "@/api/omManger/dept";
export default {
  props: {
    modalObjj: {
      type: String,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      dialogFormVisible: false,
      type: '',
      id: '',
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    initial (value, type) {
      this.dialogFormVisible = true;
      this.id = value
      this.type = type
      if (this.type === '1') {
        this.details();
      }
    },
    async details () {
      const that = this;
      try {
        that.loading = true;
        const response = await findById({ id: this.id });
        that.loading = false;
        that.ruleForm.name = response.data.data.name
      } catch (even) {
        that.$message.error("数据获取失败");
      }
    },
    ClearTextConeten() {
      this.$refs["ruleForm"].resetFields();
      this.id = "";
      this.ruleForm.name = "";
      this.dialogFormVisible = false;
    },

    // 更新数据
    onSubmit (formValue) {
      let that = this
      that.$refs[formValue].validate(async (index) => {
        if (index === false) {
          return false
        }
        let response = null
        if (that.type === '1') {
          this.ruleForm.id = this.id
          response = await update(this.ruleForm);
        } else {
          this.ruleForm.parentId = this.id
          response = await insert(this.ruleForm);
        }
        that.loading = false;
        if (response.data.code === 1) {
          that.$message.success(response.data.msg);
          that.ClearTextConeten();
          that.$emit("Reload");
        } else {
          that.$message.error(response.data.msg);
          return false;
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-pagination {
    margin: 0px;
    padding: 0px
  }

</style>
