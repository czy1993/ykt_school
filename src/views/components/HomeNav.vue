<template>
  <div id="home_nav">
    <h2>
      <span>{{title}}</span> 
      <slot name="left"></slot>
    </h2>
    <div>
        <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        title:String
    }
};
</script>

<style lang="scss" scoped>
#home_nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px 0;
    h2{
        font-size: 16px;
        display: flex;
        align-items: center;
        &>span{
            margin-right: 20px;
        }
    }
}
</style>
