<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
        <el-popover placement="top-end" width="280" trigger="hover">
          <div class="hover-view" v-if="show2" >
            <div>
              <span class="texts"
                ><span>●</span> {{ `您有${upCount}条课程上架申请处理` }}</span
              >
              <el-button type="text" @click="$router.push('/teaching/dean')"
                >前往处理</el-button
              >
            </div>
            <div>
              <span class="texts"
                ><span>●</span> {{ `您有${downCount}条课程下架申请处理` }}</span
              >
              <el-button type="text" @click="$router.push('/teaching/dean')"
                >前往处理</el-button
              >
            </div>
          </div>
          <p v-else>暂无通知</p>
          <el-badge
            slot="reference"
            v-show="show1"
            :is-dot="show2"
            class="right-menu-item"
          >
            <i class="el-icon-bell"></i>
          </el-badge>
        </el-popover>
        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";
import { courseList } from "@/api/teacher";
import { removeToken } from "@/utils/auth";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
  },
  data() {
    return {
      show1: true,
      show2: false,
      downCount: 0,
      upCount: 0,
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    ...mapState({
      permissions: (state) => state.user.permissions,
    }),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
  },
  created() {
    console.log(this.permissions.includes("school:course:list"));
    console.log(this.permissions.includes("*:*:*"));
    if (
      this.permissions.includes("school:course:list") == true ||
      this.permissions.includes("*:*:*") == true
    ) {
      this.show1 = true;
      this.get_courseList();
      setTimeout(() => {
        this.get_courseList();
      }, 30 * 1000);
    } else {
      this.show1 = false;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // this.$store.dispatch("LogOut").then(() => {
        //   location.reload();
        // });
         removeToken();
          location.reload();
      });
    },
    get_courseList() {
      courseList().then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.downCount = res.data.downCount;
          this.upCount = res.data.upCount;
          if (res.data.downCount + res.data.upCount == 0) {
            this.show2 = false;
          } else {
            this.show2 = true;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" >
.navbar {
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

  .errLog-container {
    display: inline-block;
    vertical-align: top;
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
      .hover-view {
        width: 300px;
        div {
          width: 300px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .texts {
            margin-right: 20px;
            display: flex;
            align-items: center;
            span {
              display: none;
              color: #ff4949 !important;
            }
          }
        }
      }
    }
    .el-badge__content.is-fixed {
      top: 16px;
      right: 10px;
    }
    .el-icon-bell {
      font-size: 20px;
      font-weight: 700;
      color: #5a5e66;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

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
