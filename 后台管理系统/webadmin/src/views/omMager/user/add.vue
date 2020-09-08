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
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item prop="name" label="用户名:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input
          clearable
          :disabled="nowId?true:false"
          autocomplete="off"
          v-model="ruleForm.name"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="tel" label="手机号:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input
          clearable
          autocomplete="off"
          :disabled="disabled"
          v-model="ruleForm.tel"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input
          clearable
          autocomplete="off"
          :disabled="disabled"
          v-model="ruleForm.email"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="0" :disabled="disabled">男</el-radio>
          <el-radio label="1" :disabled="disabled">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input v-if="!disabled" v-model="openDeptName[openDeptName.length - 1]" readonly="" placeholder="请点击选择部门">
          <el-button slot="append" icon="el-icon-circle-plus" @click="openDeptClick"></el-button>
        </el-input>
        <el-input v-else v-model="openDeptName[openDeptName.length - 1]" disabled="">
        </el-input>
      </el-form-item>

      <el-form-item label="岗位:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input
          clearable
          autocomplete="off"
          :disabled="disabled"
          v-model="ruleForm.job"
          placeholder="请输入岗位"
        ></el-input>
      </el-form-item>

      <el-form-item label="职务:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-input
          clearable
          autocomplete="off"
          :disabled="disabled"
          v-model="ruleForm.duty"
          placeholder="请输入职务"
        ></el-input>
      </el-form-item>
      <el-form-item prop="roleId" label="角色:" :label-width="this.formLabelWidth" class="InpitWidth">
        <el-select
          v-model="ruleForm.roleId"
          :disabled="disabled"
          clearable
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="demo-drawer__footer drawer_footer">
      <el-button @click="CloseModal">取 消</el-button>
      <el-button v-if="modalObjj!=='详情'" type="primary" @click="SuretoAddClick('ruleForm')">确 定</el-button>
    </div>
    <el-dialog title="部门选择" append-to-body width="50%" :visible.sync="isDeptShow" :show-close="false" :close-on-click-modal='false'>
      <el-form ref="form">
        <el-breadcrumb separator="/" style="margin-bottom:20px;padding-bottom:10px;border-bottom: 1px solid #f1f1f1;">
          <el-breadcrumb-item v-for="(item, index) in openDeptName" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class='el-row-el ele-tree ml'>
          <el-tree :data="DeptList" node-key="id" default-expand-all :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span @click="deptClick(data)">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deptAdd">确 定</el-button>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { findAll } from "@/api/omManger/dept";
import { insert, update, roleList, findById } from "@/api/omManger/user";
import { isMPStrict } from "@/utils/validate";
export default {
  props: {
    modalObjj: {
      type: String,
      default: () => {}
    }
  },

  data() {
    return {
      nowId: '',
      disabled: false,
      ruleForm: {
        tel: "",
        email: "",
        sex: "0",
        dept: '',
        name: "",
        duty: "",
        job: "",
        roleId: ""
      },
      roleList: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["change", "blur"]
          },
          {
            pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g, //正则
            message: "请输入正确的手机号"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, //正则
            message: "请输入正确的邮箱"
          }
        ],
        roleId: [
          {
            required: true,
            message: "请选择角色",
            trigger: ["change", "blur"]
          }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      loading: false,
      // 部门
      isDeptShow: false,
      // 将一级部门存上，用于二次选择部门，仍显示一级部门内容
      openDeptIdAdd: '',
      openDeptNameAdd: [],
      tsDeptListAdd: [],
      // 当前节点内容
      openDeptId: '',
      openDeptName: [],
      tsDeptList: [],
      // 生成每一级树结构
      DeptList: []
    };
  },
  watch: {
    show() {
      this.dialogFormVisible = this.show;
    }
  },
  methods: {
    initial: function(value) {
      this.roleList = []
      this.nowId = ''
      this.disabled = false
      this.dialogFormVisible = true;
      this.getDeptList()
      this.getRoleList();
      if (value) {
        this.nowId = value;
      }
    },
    // 获取所属部门
    async getDeptList() {
      const that = this;
      try {
        that.loading = true;
        const res = await findAll({});
        that.loading = false;
        if (res.data.code === 1) {
          if (res.data.data !== '' && res.data.data !== null && res.data.data.length > 0) {
            let Data = this.parseJson(res.data.data)
            // 将一级部门存上，用于二次选择部门，仍显示一级部门内容
            that.openDeptIdAdd = Data[0].id
            that.openDeptNameAdd.push(Data[0].label)
            that.tsDeptListAdd = Data[0].children
            // 当前节点内容
            that.openDeptId = Data[0].id
            that.openDeptName.push(Data[0].label)
            that.tsDeptList = Data[0].children
            // 生成每一级树结构
            if (Data[0].children !== null) {
              let arr = []
              Data[0].children.forEach(item => {
                arr.push({
                  id: item.id,
                  label: item.label
                })
              })
              that.DeptList = arr
            }
          }
          if (this.nowId) {
            this.initFormDetail();
          }
        } else {
          that.$message.error(res.data.msg)
        }
      } catch (even) {
        console.log(even);
        this.$message.error(even.msg);
      }
    },
    // 重写字段名
    parseJson(arr) {
      let keyLabel = "label";
      let key = "children";
      function toParse(arr) {
        arr.forEach(function (item) {
          if (item.subGroups && Array.isArray(item.subGroups)) {
            item[key] = item.subGroups;
            item[keyLabel] = item.name;
            toParse(item[key]);
          }
          delete item.name;
          delete item.subGroups;
        });
        return arr;
      }
      return toParse(arr);
    },
    openDeptClick () {
      this.isDeptShow = true
      // 展示一级部门
      this.openDeptId = this.openDeptIdAdd
      this.openDeptName = JSON.parse(JSON.stringify(this.openDeptNameAdd))
      this.tsDeptList = JSON.parse(JSON.stringify(this.tsDeptListAdd))
      let arr = []
      this.tsDeptList.forEach(item => {
        arr.push({
          id: item.id,
          label: item.label
        })
      })
      this.DeptList = arr
    },
    deptAdd () {
      this.$refs['form'].resetFields()
      this.isDeptShow = false
    },
    deptClick (res) {
      let arr = []
      let ifExist = false
      // 循环当前部门级别内容
      this.tsDeptList.forEach(item => {
        // 是否存在子级，包含子级继续向下查询
        if (item.id === res.id && item.children.length > 0) {
          ifExist = true
          // 展示一级部门
          this.openDeptId = item.id
          this.openDeptName.push(item.label)
          this.tsDeptList = item.children
          item.children.forEach(item => {
            arr.push({
              id: item.id,
              label: item.label
            })
          })
          this.DeptList = arr
        }
      })
      if (!ifExist && this.openDeptId !== res.id) {
        this.openDeptName.push(res.label)
        this.openDeptId = res.id
        this.isDeptShow = false
      }
      if (!ifExist && this.openDeptId === res.id) {
        this.isDeptShow = false
      }
    },
    async initFormDetail() {
      const that = this;
      try {
        const response = await findById({ id: this.nowId });
        that.ruleForm = response.data.data;
        that.openDeptId = response.data.data.dept
        that.openDeptName.push(response.data.data.deptName)
        if (this.modalObjj === "详情") {
          this.disabled = true
        }
      } catch (even) {
        console.log(even)
        that.$message.error("数据获取失败");
      }
    },

    CloseModal() {
      const that = this;
      that.ClearTextConeten();
    },

    // 初始化表单
    ClearTextConeten() {
      const that = this;
      that.$refs["ruleForm"].resetFields();
      that.ruleForm.id = "";
      that.ruleForm.tel = "";
      that.ruleForm.duty = "";
      that.ruleForm.name = "";
      that.ruleForm.roleId = "";
      that.ruleForm.dept = "";
      that.ruleForm.job = "";
      that.ruleForm.email = "";
      that.dialogFormVisible = false;

      that.openDeptIdAdd = ''
      that.openDeptNameAdd = []
      that.tsDeptListAdd = []
      
      that.openDeptId = ''
      that.openDeptName = []
      that.tsDeptList = []
      
      that.DeptList = []
    },

    SuretoAddClick(ruleForm) {
      const that = this;
      that.$refs[ruleForm].validate(async index => {
        if (index === false) {
          return false;
        }
        that.loading = true;
        this.roleList.forEach(item => {
          if (this.ruleForm.roleId === item.id) {
            this.ruleForm.roleName = item.name;
          }
        });
        let response = null
        this.ruleForm.dept = this.openDeptId
        if (that.nowId) {
          this.ruleForm.id = that.nowId;
          response = await update(this.ruleForm);
        } else {
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
      });
    },
    async getRoleList() {
      const that = this;
      const response = await roleList();
      if (response.data.code === 1) {
        response.data.data.content.map(function(v) {
          that.roleList.push({ id: v.id, name: v.name });
        });
      } else {
        that.$message.error(response.data.msg);
        return false;
      }
    }
  }
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
