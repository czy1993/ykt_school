<template>
  <div id="studentArrive">
    <header>
      <ul @click="select">
        <li data-id="1" :class="{'activeClass':mark==='1'}">到课异常统计</li>
        <li>|</li>
        <li data-id="2" :class="{'activeClass':mark==='2'}">学生到课明细</li>
      </ul>
    </header>
    <div>
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mark: "1"
    };
  },
  components: {
    abnormalStatic: () => import("./AbnormalStatic"),
    arriveDetail: () => import("./ArriveDetail")
  },
  computed: {
    currentComponent() {
      let type = {
        "1": "abnormal-static",
        "2": "arrive-detail"
      };
      return type[this.mark];
    }
  },
  methods: {
    select(e) {
      let target = e.target;
      if (target.dataset.id) {
        this.mark = target.dataset.id;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
#studentArrive {
  @include container;
  header {
    .activeClass {
      color: #17509d;
    }
    ul {
      display: flex;
      align-items: center;
      li {
        margin: 0 7px;
        user-select: none;
        &:not(:nth-of-type(2)) {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
