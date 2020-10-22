<template>
  <div id="arriveCenter" v-loading="loading">
    <div class="display">
      <section class="tab">
        <h3>今日教师开课情况</h3>
        <p>
          停课
          <i class="font white">{{teacherTodayArrive.cntOpenSuspend||0}}</i> 节
        </p>
        <p>
          开课
          <i class="font green">{{teacherTodayArrive.cntOpenNormal||0}}</i> 节，准时率
          <i class="font green">{{punctuality+'%'}}</i>
        </p>
        <p @click="$router.push('/arriveClass/teacherArrive')" class="detail">详情</p>
      </section>
      <section class="tab">
        <h3>今日学生到课情况</h3>
        <p>
          无故缺课
          <i class="font white">{{studentTodayArrive.absentCnt||0}}</i>人，请假
          <i class="font white">{{studentTodayArrive.leaveCnt||0}}</i>人，巡检异常
          <i class="font white">{{studentTodayArrive.errorCnt||0}}</i>人，上课时长不足
          <i class="font white">{{studentTodayArrive.notEnoughCnt||0}}</i>人
        </p>
        <p>
          到课
          <i class="font green">{{arriveNum}}</i> 人，认真听课率
          <i class="font green">{{serious}}%</i>
        </p>
        <p @click="$router.push('/arriveClass/studentArrive')" class="detail">详情</p>
      </section>
    </div>
    <div class="charts">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="beginStatic">
            <chart-unit :title="'开课统计'" :chartData="openBarData" type="bar" data-type="teacherBar"></chart-unit>
          </div>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :lg="8">
          <div class="timeStatic">
            <chart-unit :title="'时长统计'" :chartData="lineData" type="line"></chart-unit>
          </div>
        </el-col>-->
      </el-row>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="arriveStatic">
            <chart-unit
              :title="'到课统计'"
              :chartData="arriveBarData"
              type="bar"
              data-type="studentBar"
            ></chart-unit>
          </div>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :lg="8">
          <div class="timeStatic">
            <chart-unit :title="'到课统计'" :chartData="lineData" type="line"></chart-unit>
          </div>
        </el-col>-->
      </el-row>
    </div>
  </div>
</template>

<script>
import ChartUnit from "./ChartUnit.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { today } from "@/utils";
export default {
  data() {
    return {
      loading: false,
      openBarData: {
        data: [],
        x: []
      },
      arriveBarData: {
        data: [[], [], [], []],
        x: []
      }
      // lineData: {
      //   data: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      //   x: ["07-01", "07-03", "07-09", "07-15"]
      // }
    };
  },
  computed: {
    ...mapState("student", ["chartData"]),
    ...mapGetters("student", ["teacherTodayArrive", "studentTodayArrive"]),
    punctuality() {
      let sus = this.teacherTodayArrive.cntOpenSuspend || 0;
      let nor = this.teacherTodayArrive.cntOpenNormal || 0;
      return Number.isNaN(((nor - sus) / nor))? 0.00:(((nor - sus) / nor) * 100).toFixed(0);
    },
    arriveNum() {
      let total = this.studentTodayArrive.totalCnt || 0;
      let ab = this.studentTodayArrive.absentCnt || 0;
      let le = this.studentTodayArrive.leaveCnt || 0;
      return total - ab - le;
    },
    serious() {
      let nor = this.studentTodayArrive.normalCnt || 0;
      return Number.isNaN(nor / this.arriveNum)?0.00:((nor / this.arriveNum) * 100).toFixed(0);
    }
  },
  created() {
    this.initData();
   
  },
  components: {
    ChartUnit
  },
  methods: {
    ...mapActions("student", ["oneMonthCourseMessage"]),
    initData() {
      this.loading = true;
      this.oneMonthCourseMessage({
        monthStr: today(new Date())
          .split(" ")[0]
          .slice(0, 7)
      })
        .then(res => {
          this.loading = false;
          this.generateTeacherTabList();
          this.generateStudentTabList();
           console.log(this.arriveNum,this.studentTodayArrive)
        })
        .catch(err => {
          this.loading = false;
        });
    },
    generateTeacherTabList() {
      let arr = [[], []],
        x = [];
      for (let item of this.chartData.openCourseCnts) {
        arr[0].push(item.cntOpenSuspend);
        arr[1].push(item.cntOpenNormal);
        x.push(item.tempDate.slice(5));
      }
      this.openBarData.data = arr;
      this.openBarData.x = x;
    },
    generateStudentTabList() {
      let arr = [[], [], [], []],
        x = [];
      for (let item of this.chartData.courseStatusCnts) {
        arr[0].push(item.absentCnt);
        arr[1].push(item.leaveCnt);
        arr[2].push(item.errorCnt);
        arr[3].push(item.notEnoughCnt);
        x.push(item.tempDate.slice(5));
      }
      this.arriveBarData.data = arr;
      this.arriveBarData.x = x;
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin font($color: #fff) {
  font-weight: 900;
  font-style: normal;
  font-size: 18px;
  color: $color;
}

#arriveCenter {
  background-color: #f7f7f7;
  padding: 18px 29px;
  font-size: 14px;
  .detail {
    text-decoration: underline;
    cursor: pointer;
  }
  .display {
    display: flex;
    margin-bottom: 22px;
    .tab {
      padding: 22px 35px 18px;
      background-color: #5355fd;
      border-radius: 8px;
      color: #fff;
      flex-basis: 478px;
      margin-right: 32px;
      &:nth-of-type(2) {
        background-color: #6635e3;
      }
      h3,
      p {
        margin-bottom: 12px;
      }
      p {
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
        .font.white {
          @include font();
        }

        .font.green {
          @include font(#6dd739);
        }
      }
    }
  }
  .charts {
    .beginStatic,
    .arriveStatic {
      background-color: #fff;
      height: 400px;
      padding: 20px;
      margin-bottom: 16px;
    }

    flex: 1.5;
    .timeStatic {
      background-color: #fff;
      height: 400px;
      padding: 20px;
      margin-bottom: 15px;
      margin-left: 15px;
    }
  }
}
</style>
