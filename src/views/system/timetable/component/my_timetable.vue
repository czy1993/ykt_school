<template>
  <div class="my-timetable">
    <h4>我的课程</h4>
    <div class="my-timetable-center">
      <div class="calendar-view">
        <el-calendar v-model="days">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" slot-scope="{date, data}">
            <div :class="['calendar-d',data.isSelected ? 'is-selected' : '']">
              {{ data.day.split('-')[2] }} {{ data.isSelected ? '✔️' : ''}}
              <span
                  v-show="dealMyDate(data.day)"
                  class="day_active"
              ></span>
            </div>
          </template>
        </el-calendar>
      </div>
      <div class="timetable-view">
          <CourseList :name="'teacher'"  ref="CourseList" ></CourseList>
      </div>
    </div>
    <!-- <Transfer></Transfer> -->
  </div>
</template>
<script>
import { queryGrade, queryClass } from "@/api/index.js";
import { today, deepCopy } from "@/utils/index.js";
import {teacherTimetable } from '@/api/teacher.js';
import CourseList from "../../dean/components/dean_center";
import Transfer from './transfer'
export default {
    components:{
        CourseList,
        Transfer
    },
  data() {
    return {
      resDate: [],
      days:new Date(),
    };
  },
  created() {
      this.get_teacherTimetable()
  },
  methods: {
    // 查询日历
    get_teacherTimetable() {
      let day = today(this.days) ;
      teacherTimetable(day).then((res) => {
        if (res.code == 200) {
          this.resDate = res.data;
        }
      });
    },
    // 遍历 日历-当天是否有课
    dealMyDate(v) {
      let len = this.resDate.length;
      let res = "";
      for (let i = 0; i < len; i++) {
        if (this.resDate[i].day == v) {
          res = this.resDate[i].day;
          return true;
        }
      }
      return false;
    },
  },
  watch:{
    days(val) {
      console.log();
      this.get_teacherTimetable()
      this.$refs.CourseList.get_timetableList(
        today(val).substring(0, 10)
      );
    },
  }
};
</script>
<style lang="scss" >
.my-timetable {
     margin-right: 10px;
    box-sizing: border-box;
    padding:5px 20px;
     border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    margin-bottom: 10px;
    h4{
      padding: 10px;
    }
  .my-timetable-center {
    display: flex;
    .calendar-view {
      width: 440px;
      .el-calendar-day {
        box-sizing: border-box;
        padding: 5px;
        height: 60px;
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        font-size: 20px;
      }
      .day_active{
           position: absolute;
          right: 5px;
          bottom: 5px;
          height: 10px;
          width: 10px;
          border-radius: 10px;
          background-color: #6dd739;
      }
    }
    .timetable-view {
      flex: 1;
    }
  }
}
</style>