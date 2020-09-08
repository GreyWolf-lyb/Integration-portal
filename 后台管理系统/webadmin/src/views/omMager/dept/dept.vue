<template>
  <el-main>
    <el-col :span="24" class="warp-main" v-loading="isSubmitLoading">
      <el-form label-width="120px">
        <el-row class="el-row-el ele-tree ml">
          <el-tree
            :data="data2"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="success"
                  size="mini"
                  @click="() => append(data)"
                >
                  添加
                </el-button>
                <el-button type="success" size="mini" @click="() => edit(data)">
                  编辑
                </el-button>
                <el-button
                  v-show="data.path !== '0000'"
                  type="danger"
                  size="mini"
                  @click="() => deleteData(data)"
                >
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-row>
      </el-form>
    </el-col>
    <deptAdd :modal-objj="title" ref="add" @Reload="allSubmit"></deptAdd>
  </el-main>
</template>

<script>
import { findAll, deleteData } from "@/api/omManger/dept";
import deptAdd from "./deptAdd";
export default {
  components: { deptAdd },
  data() {
    return {
      title: "",
      data2: [],
      isSubmitLoading: false,
    };
  },

  mounted() {
    this.isSubmitLoading = false;
    this.allSubmit();
  },

  methods: {
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
    async allSubmit() {
      try {
        const res = await findAll({});
        if (res.data.code === 1) {
          this.isSubmitLoading = false;
          this.data2 = this.parseJson(res.data.data);
        } else {
          this.$message.error(res.data.msg);
        }
      } catch (even) {
        console.log(even);
        this.$message.error(even.msg);
      }
    },

    // 添加
    append(data) {
      this.title = "添加";
      this.$refs.add.initial(data.id, "0");
    },
    // 编辑
    edit(data) {
      this.title = "编辑";
      this.$refs.add.initial(data.id, "1");
    },

    // 删除数据
    deleteData(row) {
      const that = this;
      that
        .$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          type: "warning",
        })
        .then(async () => {
          that.Loading = true;
          const response = await deleteData(row.id);
          that.Loading = false;
          if (response.data.code === 1) {
            that.$message.success("删除成功");
            this.allSubmit();
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-pagination {
  margin: 0px;
  padding: 0px;
}
.el-tree-node__content {
  margin-bottom: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
