<template>
  <div class="navbar admin">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../assets/image/user.png" class="user-avatar" />
          <span class="names">{{username}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link> -->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/webadmin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided @click.native="add">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <drawer ref="call" :drawer-dialog="mode"></drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { resetPassword } from "@/api/user";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import transmit from "../../utils/transmit";
import drawer from "@/components/dialog/dialog.vue";
import md5 from "js-md5";
import { user } from "@/views/login";
import { sessionStorageSet, sessionStorageGet } from "@/utils/storage";
import { removeToken } from "@/utils/auth";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    drawer
  },
  data() {
    return {
      username: sessionStorageGet("name"),
      collapse: false,
      mode: {
        type: "dialog",
        form: [
          {
            type: "input",
            label: "旧密码:",
            placeholder: "请输入旧密码",
            model: "oldPassword",
            state: ["detail", "new", "modify"],
            rules: [
              {
                required: true,
                message: "请输入旧密码",
                trigger: "blur"
              }
            ]
          },
          {
            type: "input",
            label: "新密码:",
            placeholder: "请输入新密码",
            model: "newPassword",
            state: ["detail", "new", "modify"],
            rules: [
              {
                required: true,
                message: "请输入新密码",
                trigger: "blur"
              }
            ]
          }
        ],
        event: [
          {
            bind: "increase",
            method: row => {
              this.increase(row);
            }
          },
          {
            bind: "modify",
            method: row => {
              console.log("aaaaaaaaa");
              this.bindModify(row);
            }
          }
        ]
      }
    };
  },
  created() {
    // console.log(localStorage.getItem("username"), "用户信息");
    // console.log(localStorage.getItem("password"), "用户信息");
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "id"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
      this.collapse = !this.sidebar.opened;
      transmit.$emit("collapse", this.collapse);
    },
    //单点登录退出
    logout() {
      this.$confirm("是否退出登录?", "提示", {
        type: "warning"
      })
        .then(async () => {
          this.logoutFn();
        })
        .catch(() => {
          return false;
        });
    },
    async increase(row) {
      const data = {
        // md5修改密码
        // id: sessionStorageGet("id"),
        // newPassword: md5(row.data.newPassword),
        // oldPassword: md5(row.data.oldPassword)
        //明文修改密码
        newPassword: row.data.newPassword,
        oldPassword: row.data.oldPassword
      };

      try {
        let res = await resetPassword(data);
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          this.logoutFn();
          this.$refs.call.closeDialog();
        } else {
          this.$message.error(res.data.msg);
        }
      } catch (even) {
        this.$message.error(even.msg);
      }
    },
    logoutFn() {
      let url = process.env.VUE_APP_SSOOUT_API;
      sessionStorageSet("id", undefined);
      sessionStorageSet("name", undefined);
      removeToken();
      window.open(url, "_self");
    },
    add() {
      this.$refs.call.popup("修改密码", "increase", "");
    }
  }
};
</script>

<style lang="scss" scoped>
.admin {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        display: flex;
        align-items: center;
        .names {
          display: inline-block;
          line-height: 40px;
          color: #7eb2fb;
          margin: 0 5px;
          font-size: 16px;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
