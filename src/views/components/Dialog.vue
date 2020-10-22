<template>
  <transition name="pop">
    <div v-show="value" id="education_dialog">
      <div class="header">
        <i @click="back" class="el-icon-back"></i>
      </div>
      <div class="dialog_container">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean
    }
  },
  model: {
    prop: "value",
    event: "click"
  },
  methods: {
    back() {
      this.$emit("click", false);
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$emit("open", val);
        document.documentElement.scrollTop="100%";
        document.documentElement.style.overflow='hidden'
      } else {
        this.$emit("close", val);
        document.documentElement.style.overflow='auto'
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pop-enter {
  transform: scale(0.2);
}

.pop-enter-to {
  transform: scale(1);
}
.pop-enter-active {
  transition: all 0.3s;
  transform-origin: bottom right;
}

#education_dialog {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right:0;
  bottom:0;
  z-index: 1000;
  overflow: hidden;

  display: flex;
  flex-direction: column;
}

.dialog_container {
  width: 100%;
  flex: 1;
  padding: 20px;
  background: #fff;
  overflow: auto;
}
.header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 10px 20px;
  .el-icon-back {
    font-size: 30px;
    cursor: pointer;
  }
}
</style>
