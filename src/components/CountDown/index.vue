<template>
  <span id="countDown">{{millisecond?formatTime:endTip}}</span>
</template>

<script>
export default {
  props: {
    time: {
      //   type: Number, //毫秒
      required: true
    },
    bindTime: {
      //还剩多少秒时，触发绑定事件
      type: Number //毫秒
    },
    endTip: {
      //倒计时结束的文字提示
      type: String,
      default: '上课中'
    }
  },
  data() {
    return {
      timer: null,
      millisecond: 0
    };
  },
  computed: {
    formatTime: {
      get() {
        if (
          typeof this.millisecond === 'number' &&
          !Number.isNaN(this.millisecond)
        ) {
          return this.format(this.millisecond);
        } else {
          return this.time;
        }
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      clearInterval(this.timer);
      this.millisecond = Math.trunc(this.time / 1000);
      if (
        typeof this.millisecond === 'number' &&
        !Number.isNaN(this.millisecond)
      ) {
        this.timer = setInterval(() => {
          --this.millisecond;
          if (this.millisecond > 0) {
            if (this.millisecond <= this.bindTime / 1000) {
              this.$emit('bindTime');
            }
          } else {
            this.$emit('end');
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },
    format(time) {
      let hour = Math.floor(time / 60 / 60);
      let min = Math.floor((time / 60 / 60 - hour) * 60);
      let s = this.change(
        Math.round(((time / 60 / 60 - hour) * 60 - min) * 60)
      );
      if (s >= 60) {
        min += 1;
        s = "00";
      }
      if (min >= 60) {
        hour += 1;
        min = 0;
      }
      let m = this.change(min);

      let h = this.change(hour);
      return h + ":" + m + ":" + s;
    },
    change(t) {
      if (t < 10) {
        return '0' + t;
      } else {
        return t;
      }
    }
  },
  watch: {
    time() {
      this.init();
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
#countDown {
  color: #ff7300;
  font-style: normal;
  font-weight: bold;
}
</style>
