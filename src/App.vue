<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style>
.blue {
  color: #ff7300;
}
.red {
  color: #f54545;
  margin-right: 4px;
  font-size: 20px;
  font-weight: 700;
}
.bor-shadow {
  border-bottom: 1px solid #eceef1;
  border-top: 1px solid #eceef1;
  box-shadow: 0px 1px 3px 0px #eceef1;
  margin-bottom: 15px;
}
</style>
