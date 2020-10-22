<template>
  <div id="defaultPage">
    <div>
      <img :src="require('@/assets/image/ico_qs.png')" alt>
      <p>目前暂无课程内容哦！</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#defaultPage {
  & > div {
    height: 500px;
    border: 1px solid #eeeeee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      color: #666;
      margin-top: 50px;
    }
  }
}
</style>
