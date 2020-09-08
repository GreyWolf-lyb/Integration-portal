<template>
  <div class="article-add">
    <el-form
      :model="numberValidateForm"
      ref="numberValidateForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        v-if="isId == '1'"
        label="文章id"
        prop="id"
        :rules="[{ required: true, message: '文章id不能为空' }]"
      >
        <el-input
          :disabled="isInput"
          v-model="numberValidateForm.id"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="标题"
        prop="title"
        :rules="[{ required: true, message: '标题不能为空' }]"
      >
        <el-input
          :disabled="isInput"
          v-model="numberValidateForm.title"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
          :disabled="isInput"
          v-model="numberValidateForm.author"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="来源名称" prop="name">
        <el-input
          :disabled="isInput"
          v-model="numberValidateForm.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="来源路径" prop="srcUrl">
        <el-input
          :disabled="isInput"
          v-model="numberValidateForm.srcUrl"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="略缩图" prop="chart">
        <div v-if="numberValidateForm.icon">
          <el-image
            style="width: 220px; height: 220px"
            :src="ImgUrl"
            :preview-src-list="[ImgUrl]"
          ></el-image>
          <el-row
            style="text-align: center;z-index: 1; width:220px;"
            v-if="!isInput"
          >
            <el-button type="danger" size="mini" round @click="deleteImg"
              >删除</el-button
            >
          </el-row>
        </div>
        <div v-if="!isInput">
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
              上传
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 30px;float: left;margin-top: 5px;"
            @click="uploadEd"
          >
            从资源库上传
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="文章摘要" prop="article">
        <el-input
          :disabled="isInput"
          type="textarea"
          v-model="numberValidateForm.article"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="网页内容" prop="content">
        <div class='edit_main' v-html='numberValidateForm.content' v-if="isInput"></div>
        <Editor @monitor="monitor" ref="ChildData" v-else></Editor>
      </el-form-item>
      <div class="footer-button">
        <el-button
          type="primary"
          v-if="!isInput"
          @click="submitForm('numberValidateForm')"
          >保存</el-button
        >
        <el-button @click="resetForm('numberValidateForm')">返回</el-button>
      </div>
    </el-form>
    <el-dialog
      title="资源库"
      :visible.sync="dialogIcon"
      class="el_Dialog open"
      style="height:100vh;overflow: auto;"
    >
      <UpLoadFile
        ref="UpLoadFile"
        :typeAccess="'1'"
        @formChild="formChild"
      ></UpLoadFile>
    </el-dialog>
  </div>
</template>
<script>
import Editor from "@/components/richText";
import UpLoadFile from "@/components/UpLoadFile";
import { artDetails, artAdd, artEdit } from "@/api/resources";
import { categoryDetails } from "@/api/resources";
export default {
  components: {
    Editor,
    UpLoadFile
  },
  data() {
    return {
      type: '',
      isId: "",
      isInput: false,
      isSubmitLoading: false,
      dialogIcon: false,
      ImgUrl: "",
      fileUrl: process.env.VUE_APP_BASE_API + "service/base/file/uploadFile",
      header: {
        Authorization: "token " + localStorage.getItem("token")
      },
      numberValidateForm: {
        id: "",
        title: "",
        author: "",
        name: "",
        srcUrl: "",
        chart: "",
        article: "",
        content: "",
        icon: ""
      }
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        if (to.params.is === "edit") {
          this.type = '1'
          this.isInput = false;
          this.echoData(to.params.id);
        }
        if (to.params.is === "details") {
          this.isInput = true;
          this.echoData(to.params.id);
        }
      }
    }
  },
  mounted() {
    this.numberValidateForm.id = this.common.session("categoryId");
    this.categoryDetails();
  },
  methods: {
    categoryDetails() {
      this.title = "编辑栏目";
      this.dialogFormVisible = true;
      categoryDetails({ id: this.numberValidateForm.id })
        .then(res => {
          this.isId = res.data.data.isId;
        })
        .catch(err => {
          console.log(err, "获取详情失败");
        });
    },
    // 详情回显
    echoData(id) {
      artDetails({ id: id }).then(res => {
        this.id = res.data.data.id;
        this.numberValidateForm.id = res.data.data.id;
        this.numberValidateForm.title = res.data.data.title;
        this.numberValidateForm.author = res.data.data.author;
        this.numberValidateForm.name = res.data.data.srcName;
        this.ImgUrl = res.data.data.iconAbsolutePath;
        this.numberValidateForm.icon = res.data.data.icon;
        this.numberValidateForm.srcUrl = res.data.data.srcUrl;
        this.numberValidateForm.article = res.data.data.digest;
        this.numberValidateForm.content = res.data.data.messageWeb;
        if (this.type === '1') {
          this.$refs.ChildData.setContent(res.data.data.messageWeb);
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            author: this.numberValidateForm.author,
            categoryId: this.$route.query.id,
            digest: this.numberValidateForm.article,
            icon: this.numberValidateForm.icon,
            id: this.numberValidateForm.id,
            messageWeb: this.numberValidateForm.content,
            srcName: this.numberValidateForm.name,
            srcUrl: this.numberValidateForm.srcUrl,
            title: this.numberValidateForm.title
          };
          if (this.isId === "0") {
            delete data.id;
          }
          let response = null;
          if (this.$route.params.is === "add") {
            response = await artAdd(data);
          } else {
            data.id = this.id;
            data.newId = this.numberValidateForm.id;
            response = await artEdit(data);
          }
          if (response.data.code === 1) {
            this.$message.success(response.data.msg);
            this.$router.push({
              path: "articleView",
              query: {
                id: this.common.session("categoryId"),
                name: this.common.session("categoryName")
              }
            });
            return false;
          }
          this.$message.error(response.data.msg);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({
        path: `/articleView?id=${this.$route.query.id}&name=${this.$route.query.name}`
      });
    },
    uploadEd() {
      this.dialogIcon = true;
    },
    // 删除照片
    deleteImg() {
      this.numberValidateForm.icon = "";
      this.ImgUrl = "";
    },
    formChild(data) {
      this.ImgUrl = process.env.VUE_APP_URL_API + data;
      this.numberValidateForm.icon = data;
      this.$message.success("上传成功");
      this.dialogIcon = false;
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
        that.numberValidateForm.icon = response.data.filePath;
        that.$message.success(response.msg);
        return false;
      }
    },
    // 富文本编辑器内容
    monitor(html) {
      this.numberValidateForm.content = html;
    }
  }
};
</script>
<style lang="scss" scoped>
.article-add {
  width: 100%;
  margin-top: 30px;
  .edit_main{
    text-align: left;
  }
}
.footer-button {
  display: flex;
  justify-content: center;
}

.el-input,
.el-textarea {
  width: 55%;
}
</style>
