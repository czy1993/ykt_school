<template>
  <div class="app-container timetable">
    <div class="timetable-header">教师课表</div>
    <div class="timetable-center">
      <div class="my_timetable">
        <MyTimetable></MyTimetable>
        <Transfer></Transfer>
      </div>
      <div class="week_timetable">
        <WeekTimetable ref="WeekTimetable"></WeekTimetable>
      </div>
    </div>
  </div>
</template>
<script>
import MyTimetable from "./component/my_timetable";
import WeekTimetable from "./component/week_timetable";
import Transfer from "./component/transfer";
export default {
  components: {
    MyTimetable,
    WeekTimetable,
    Transfer,
  },
  data() {
    return {};
  },
  methods: {
    fatherMethod() {
      this.$refs.WeekTimetable.get_weekVideo();
    },
  },
};
</script>
<style lang="scss" scoped>
.timetable {
  .timetable-header {
    height: 50px;
    font-size: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    padding-left: 10px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .timetable-center {
    display: flex;
    .my_timetable {
      flex: 1;
    }
    .week_timetable {
      width: 320px;
      border-bottom: 1px solid #eceef1; 
      border-top: 1px solid #eceef1;
      box-shadow: 0px 1px 3px 0px #eceef1;
      box-sizing: border-box;
      padding: 5px 20px;
    }
  }
}
</style>