<template>
  <div id="home">
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Index",
  components: {
    adminHome: () => import("./components/adminHome.vue"),
    teacherHome: () => import("./components/teacherHome.vue"),
    defaultPage: () => import("./components/DefaultPage.vue")
  },
  data() {
    return {
      currentComponent: "adminHome"
    };
  },
  computed: {
    ...mapState({
      permissions: state => state.user.permissions
    })
  },
  created() {
    if (this.permissions.includes("school:course:list")) {
      this.currentComponent = "adminHome";
      // this.currentComponent = "defaultPage";
      //  this.currentComponent = "teacherHome";
    } else if (this.permissions.includes("system:teacher:course")) {
      this.currentComponent = "teacherHome";
    } else {
      this.currentComponent = "defaultPage";
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#home {
  padding: 20px;
}
</style>
