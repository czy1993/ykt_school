<template>
  <div id="classBox">
    <el-card shadow="hover" :body-style="{ padding: '20px' }">
      <h3>
        <span>{{title}}</span>
        <div>
          <slot name="right"></slot>
        </div>
      </h3>
      <section>
        <el-image
          style="width: 80px;height:80px"
          :src="require(`@/assets/class_img/${img||'class_01'}.png`)"
          :fit="fit"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>

        <div class="_message">
          <slot></slot>
        </div>
      </section>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    img: String
  },
  data() {
    return {
      fit: "cover"
    };
  }
};
</script>

<style lang="scss" scoped>
#classBox {
  width: 400px;
  font-size: 14px;
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 10px;
  }
  section {
    display: flex;
    ._message {
      margin-left: 20px;
    }
  }
}
</style>
