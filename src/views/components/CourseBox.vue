<template>
  <div id="course_box">
    <el-card shadow="hover" :body-style="{ padding: '20px' }">
      <h3>
        <span class="title">{{title}}</span>
        <div>
          <slot name="right"></slot>
        </div>
      </h3>
      <el-image

        style="width: 100%;height:150px"
        :fit="fit"
        :src="require(`@/assets/kc_img/${img||'active'}.jpg`)"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>

      <slot></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    img:String
  },
  data() {
    return {
      fit: "cover",
      currentDate: new Date()
    };
  }
};
</script>

<style lang="scss" scoped>
#course_box {
  max-width: 360px;
  font-size: 14px;
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .title{
      display: inline-block;
      width:200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

}
</style>
