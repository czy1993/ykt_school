<template>
  <div class="app-container courseware">
    <div class="courseware-header">课件管理</div>
    <KjSchool v-if="show1"></KjSchool>
    <KjTeacher  ></KjTeacher>
  </div>
</template>
<script>
import KjSchool from "./component/kj_school";
import KjTeacher from "./component/kj_teacher";
import { mapGetters, mapState } from "vuex";
export default {
  components: {
    KjSchool,
    KjTeacher,
  },
  data() {
    return {
      show1: false,
    };
  },
  computed: {
    ...mapState({
      permissions: (state) => state.user.permissions,
    }),
  },
  created() {
    if (this.permissions.includes("*:*:*")) {
      this.show1 = true;
    } else {
      if (this.permissions.includes("school:course:list") == false) {
        this.show1 = false;
      } else {
        this.show1 = true;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.courseware {
  .courseware-header {
    height: 50px;
    font-size: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    padding-left: 10px;
    margin-bottom: 15px;
    font-weight: 600;
  }
}
</style>