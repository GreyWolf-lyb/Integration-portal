<template>
  <el-tabs type="border-card" class='el-tabs-tab' @tab-click='RunFalse'
    v-loading="isSubmitLoading"
    element-loading-text="数据加载中">
    <template v-for="Upname in Upload">
      <el-tab-pane v-if="Upname.flag" :label='Upname.TitleName' :key='Upname.id'>
        <!-- 上传按钮 -->
        <el-row v-if="typeAccess == '0'">
          <el-col :span="24">
            <el-upload class="upload-demo"
              :accept='Upname.accept'
              :action='fileUrl'
              :headers='header'
              :show-file-list='false'
              v-show='true'
              :before-upload='handleContentChange'
              :on-success='handleAvatarSuccess'>
              <el-button size="medium" type="primary" @click="judgetype(Upname.id)">{{Upname.UploadName}}</el-button>
              <div slot="tip" class="el-upload__tip">{{Upname.loadTips}}</div>
            </el-upload>
          </el-col>
        </el-row>
        <el-row :gutter="20" class='lagin'>
          <el-col :span="24" class="uploadmain">
            <template v-if="fileList.length === 0">
              <i class="el-icon-info"></i>&nbsp;{{No_data}}
            </template>
            <el-col :span="6" v-for="file in fileList" :key='file.type'>
              <div class="grid-content bg-purple">
                <!-- 图片 -->
                <template v-if="typeAccess === '0'">
                  <el-image
                    v-if="file.resourceType === '0'"
                    style="height: 160px;"
                    :src="file.resourceAbsolutePath"
                    :preview-src-list="[file.resourceAbsolutePath]"
                    @click="Selection(file.resourcePath)">
                  </el-image>
                </template>
                <template v-else>
                  <img
                    v-if="file.resourceType === '0'"
                    :src="file.resourceAbsolutePath"
                    style="width: 100%;height: 160px;"
                    class="gesture"
                    @click="Selection(file.resourcePath)" />
                </template>
                  <!-- 压缩包 -->
                <div class='border' v-if="file.resourceType !== '0'">
                  <img src="../../assets/image/zip.png" class='zipImage'/>
                </div>
                <!-- 删除按钮 -->
                <div class='file_name'>
                  <span>{{file.resourceName}}</span>
                  <el-button
                    type="danger"
                    class='delete'
                    icon="el-icon-delete"
                    circle
                    v-if="typeAccess == '0'"
                    @click="AvatarDelete(file.id)"
                  ></el-button>
                </div>
              </div>
            </el-col>
          </el-col>
        </el-row>
      </el-tab-pane>
    </template>
    <div class="Page" style="height: 5%; float:right; padding: 1% 30px 0px 0px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[20, 50, 100, 200]"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-tabs>
</template>

<script>
import {
  fileFesourceLibList,
  fileFesourceDelete,
  fileFesourceInsert
} from "@/api/resources";
import { getToken } from "@/utils/auth";
export default {
  data () {
    return {
      isSubmitLoading: true,
      dialogVisible: false,
      dialogImageUrl: '',
      No_data: '',
      Flug: '',
      Upload: [
        {
          id: 0,
          UploadName: '点击上传图片',
          TitleName: '图片',
          loadTips: '仅支持上传JPG JPEG PNG GIF文件',
          accept: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF'
        },
        {
          id: 1,
          UploadName: '点击上传压缩包',
          TitleName: 'ZIP压缩包',
          loadTips: '仅支持上传ZIP格式压缩包',
          accept: '.zip,.ZIP'
        },
        {
          id: 2,
          UploadName: '点击上传PDF',
          TitleName: 'PDF',
          loadTips: '仅支持上传PDF格式文件',
          accept: '.pdf,.PDF'
        }
      ],
      fileList: [],
      total: 0,
      pageSize: 20,
      currentPage: 1,
      type: 0,
      fileUrl: process.env.VUE_APP_BASE_API + '/service/base/file/uploadFile',
      header: {
        'Authorization': 'token ' + getToken()
      }
    }
  },
  /**
   *  @folderId 文件夹id
   *  @typeAccess 进入入口类型 ---> 0：文件夹  1：缩略图
   */
  props: ['folderId', 'typeAccess'],
  mounted () {
    let that = this
    console.log(this.typeAccess)
    this.Upload.forEach(item => {
      if (this.typeAccess === '0') {
        item.flag = true
      } else {
        if (item.TitleName === '图片') {
          item.flag = true
        }
      }
    })
    that.getList()
  },
  methods: {
    Selection: function (even) {
      if (this.typeAccess === '0') {
        return false
      }
      if (this.typeAccess === '1') {
        this.$emit('formChild', even)
        return false
      }
    },
    // 上传本地表单数据
    judgetype: function (index) {
      this.Flug = index
    },
    handleContentChange (file) {
      let that = this
      let FileSize = file.size / 1024 / 1024 < 500
      if (!FileSize) {
        that.$message.error('上传超出文件限制大小')
        return false
      }
      this.isSubmitLoading = true
    },
    handleAvatarSuccess (response, file) {
      let that = this
      if (response.code === 1) {
        that.isSubmitLoading = false
        that.UploadFile(response.data)
        return false
      }
      this.dialogVisible = true
      this.result = response.msg
      that.isSubmitLoading = false
    },

    async UploadFile (res) {
      const that = this
      try {
        let that = this
        let obj = {
          folderId: that.folderId,
          resourceType: that.Flug,
          resourceFormat: res.fileLongPath,
          resourceName: res.fileName,
          resourcePath: res.filePath
        }
        const response = await fileFesourceInsert(obj)
        if (response.data.code === 1) {
          that.$message({
            message: response.data.msg,
            type: 'success'
          })
          that.isSubmitLoading = false
          for (let i in that.Upload) {
            if (that.Upload[i].id === that.Flug) {
              that.Upload[i].content = []
            }
          }
          that.getList()
          return false
        }
        that.isSubmitLoading = false
        that.$message.error(response.data.msg)
      } catch (even) {
        that.$message.error('数据获取失败')
      }
    },

    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },

    RunFalse (tab, event) {
      let that = this
      that.type = tab.index
      that.currentPage  = '1'
      this.fileList = []
      that.getList()
    },
    // 初始化请求数据文件列表
    async getList () {
      const that = this
      try {
        let that = this
        let parameters = {
          resourceType: that.type,
          folderId: that.folderId,
          size: that.pageSize,
          page: that.currentPage
        }
        const response = await fileFesourceLibList(parameters)
        if (response.data.code === 1) {
          that.isSubmitLoading = false
          let Data = response.data.data.content
          if (Data.length === 0) {
            that.No_data = '暂无数据'
          }
          this.fileList = Data
          this.total = response.data.data.totalElements
        } else {
          that.isSubmitLoading = false
          that.$message.error('文件夹下没有资源')
        }
      } catch (even) {
        that.$message.error('数据获取失败')
      }
    },

    // 移除当前选中文件
    AvatarDelete (even) {
      const that = this
      that.$confirm('您确定要删除么?', '提示', {
        type: 'warning'
      }).then(async () => {
        const response = await fileFesourceDelete({id: even})
        that.$message.success(response.data.msg)
        that.isSubmitLoading = false
        that.getList()
      }).catch((response) => {
        that.$message.error(response.msg)
      })
    }
  }
}
</script>

<style>
  .gesture{
    cursor: pointer;
  }
  .el-main {
    flex-basis: 0% !important;
  }

  .el-tabs-tab{
    width:90% !important;
    margin-left:5%;
  }

  .el_tab_alage {
    width: 92%;
    border:1px solid #f0f0f0;
    /* margin-left:4%; */
    margin-bottom: 10px;
  }

  .el-tabs-tab .el-tabs__item {
    padding:0 30px !important;
    height: 50px;
    line-height: 50px;
  }

  .upload-demo {
    float: left;
  }

  .upload-demo .el-upload__tip {
    display: inline-block;
    margin-left: 20px;
  }

  .uploadmain {
    margin-top: 20px;
    color: #b4b4b4;
    font-size: 14px;
  }

  .uploadmain .grid-content {
    margin-bottom: 20px;
  }

  .border img {
    width: 100%;
    display: inline-block;
    vertical-align: top;
    height: 160px;
  }

  .file_name {
    width: 100%;
    height: 30px;
  }

  .file_name > span {
    display: inline-block;
    font-size: 14px;
    vertical-align:middle;
    line-height: 30px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    text-align: left;
  }

  .file_name > span:nth-child(1) {
    float: left;
    width: 75%;
    color: #606266;
  }

  .file_name > span:nth-child(2) {
    float: right;
    width: 20%;
    text-align: right;
  }

  .delete {
    font-size: 14px;
    float: right;
    cursor: pointer;
    border-radius: 3px !important;
    padding: 3px 10px !important;
    margin-top: 3px !important;
  }

  audio {
    width: 100% !important;
  }

  video {
    width: 100% !important;
    height: 150px;
    border: 1px solid rgb(228, 228, 228);
  }

  .border {
    text-align: center;
    height: 150px;
    border: 1px solid rgb(228, 228, 228);
  }

  .zipImage {
    margin-top: 20px;
    height: 120px !important;
    width: 100px !important;
  }

  @media screen and (max-width: 1030px) {
   .file_name > span:nth-child(1) {
      float: left;
      width: 50%;
      color: #606266;
    }
  }

  @media screen and (max-width: 750px) {
   .file_name > span:nth-child(1) {
      float: left;
      width: 20%;
      color: #606266;
    }
  }

  .lagin {
    width: 100% !important;
  }
</style>
