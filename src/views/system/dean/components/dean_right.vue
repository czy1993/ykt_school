<template>
  <div class="dean_right">
    <div class="dean_r-header">
      <div class>
        <span class="h5">调课管理</span>
        <!-- <el-button size="small" type="primary">节假日课程设置</el-button> -->
      </div>
      <el-button class="look-his" @click="$router.push('/1/record')" type="text">查看课程记录</el-button>
    </div>
    <div>
      <lowerApply :downApply="downApply" :downCount="downCount"></lowerApply>
      <upperApply :upApply="upApply"  :upCount="upCount"></upperApply>
    </div>
    <Adjustcourse v-if="show1" ></Adjustcourse>
  </div>
</template>
<script>
import lowerApply from "./lower_apply";
import upperApply from "./upper_apply";
import Adjustcourse from './adjust_course';
import { courseList } from "@/api/teacher.js";
export default {
  components: {
    lowerApply,
    upperApply,
    Adjustcourse
  },
  data() {
    return {
      show1:false,
      downApply: {},
      downCount: 0,
      upApply:{},
      upCount: 0,
    }
  },
  created(){
    this.get_courseList();
  },
  methods:{
    get_courseList() {
      courseList().then((res) => {
       if(res.code == 200){
           this.downApply = res.data.downApply;
           this.downCount = res.data.downCount;
           this.upApply = res.data.upApply;
           this.upCount = res.data.upCount;
       }
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.dean_right {
  .dean_r-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 15px;
    .h5 {
      font-weight: 600;
      margin-right: 10px;
    }
    .look-his {
      color: #3a9def;
    }
  }
}
</style>