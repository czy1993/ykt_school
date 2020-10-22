<template>
  <div class="app-backstage">
    <div class="backstage-header">
        <Header></Header>
    </div>
    <div class="backstage-views">
      <div class="menu">菜单</div>
      <div class="content">view</div>
    </div>
  </div>
</template>
<script>
import Header from "./component/header";
import Menu from './component/menu'
export default {
    components:{
        Header,
        Menu
    }
};
</script>
<style lang="scss" scoped>
.app-backstage {
  position: relative;
  height: 100%;
  width: 100%;
  .backstage-header {
    height: 54px;
  }
  .backstage-views {
    height: calc(100% - 54px);
    width: 100%;
    position: absolute;
    top: 54px;
    left: 0;
    display: flex;
    background: #E7EAF3;
    .menu {
      width: 200px;
      height: 100%;
      background: #ffffff;
    }
    .content {
      flex: 1;
    }
  }
}
</style>