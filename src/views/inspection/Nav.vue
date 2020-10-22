<template>
  <div id="nav">
    <div>
      <img :src="require('@/assets/logo/logo.png')" alt>
      <span>云教育系统</span>
    </div>
    <div>
      <el-button icon="el-icon-switch-button" @click.native="logout" type="primary" round>退出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.reload();
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin display {
  display: flex;
  align-items: center;
  @content;
}
#nav {
  height: 66px;
  background-color: #17509d;
  padding: 0 72px;
  @include display {
    justify-content: space-between;
  }
  & > div:nth-of-type(1) {
    @include display;
    img {
      height: 56px;
    }
    span {
      color: #fff;
      margin-left: 60px;
    }
  }
}
</style>
