<template>
  <div class="dean_cenetr">
    <div v-if="timeTableTotal">
      <div class="m_view am_view" v-show="AMtableData.length > 0">
        <div class="am mm">
          <span>AM</span>
        </div>
        <div class="Timetable-view">
          <div class="Timetable-li" v-for="(item,index) in AMtableData" :key="index">
            <span class="sk_time">{{`${item.start_time}-${item.end_time}`}}</span>
            <div class="Timetable-text">
              <div>
                <span>{{item.name}}</span>
                <span>{{item.nickName}}</span>
              </div>
              <div>
                <span>{{`${item.Duration}分钟`}}</span>
                <img
                  v-show="name=='admin'"
                  class="bi"
                  @click="edit(item.courseId)"
                  src="../../../../assets/icon/bi.png"
                  alt
                />
                <el-tooltip placement="top-start">
                  <div slot="content">
                    {{item.teachers}}
                    <br />
                    {{item.gradeClass}}
                  </div>
                  <img v-show="name=='admin'" src="../../../../assets/icon/lianjie.png" alt />
                </el-tooltip>
                <img
                  v-show="name=='teacher'"
                  class="bi"
                  @click="edit(item.courseId)"
                  src="../../../../assets/icon/duixiang.png"
                  alt
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m_view pm_view" v-show="PMtableData.length > 0">
        <div class="pm mm">
          <span>PM</span>
        </div>
        <div class="Timetable-view">
          <div class="Timetable-li" v-for="(item,index) in PMtableData" :key="index">
            <span class="sk_time">{{`${item.start_time}-${item.end_time}`}}</span>
            <div class="Timetable-text">
              <div>
                <span>{{item.name}}</span>
                <span>{{item.nickName}}</span>
              </div>
              <div>
                <span>{{`${item.Duration}分钟`}}</span>
                <img
                  v-show="name == 'admin'"
                  class="bi"
                  @click="edit(item.courseId)"
                  src="../../../../assets/icon/bi.png"
                  alt
                />
                <el-tooltip placement="top-start">
                  <div slot="content">
                    {{item.teachers}}
                    <br />
                    {{item.gradeClass}}
                  </div>
                  <img v-show="name == 'admin'" src="../../../../assets/icon/lianjie.png" alt />
                </el-tooltip>
                <img
                  v-show="name == 'teacher'"
                  class="bi"
                  @click="edit(item.courseId)"
                  src="../../../../assets/icon/duixiang.png"
                  alt
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no_kc" v-else>
      <div class="no_kc-view">
        <img src="../../../../assets/image/bg_jw_jrkc.png" alt />
        <p>当前暂无课程哦~ ~</p>
      </div>
    </div>
  </div>
</template>
<script>
import { timetableList, timetableInfo } from "@/api/teacher.js";
import { today, timeDifference } from "@/utils/index.js";
export default {
  // 新增课程
  inheritAttrs: false,
  components: {},
  props: {
    name: String,
  },
  data() {
    return {
      TimetableData: [],
      AMtableData: [],
      PMtableData: [],
      timeTableTotal: true,
    };
  },
  created() {
    
    if (this.name == "admin") {
      this.get_timetableInfo(today(new Date()), "", "");
    } else {
      this.get_timetableList(today(new Date()));
    }
  },
  methods: {
    get_timetableInfo(day, gradeName, className) {
      this.PMtableData = [];
      this.AMtableData = [];
      timetableInfo(
        `day=${day}&gradeName=${gradeName}&className=${className}`
      ).then((res) => {
        if(res.code == 200){
          this.resData(res);
        }
      });
    },
    get_timetableList(day) {
      this.PMtableData = [];
      this.AMtableData = [];
      timetableList(day).then((res) => {
         if(res.code == 200){
          this.resData(res);
        }
      });
    },
    resData(res) {
      if (res.data.length == 0) {
          this.timeTableTotal = false;
        } else {
          this.timeTableTotal = true;
          this.TimetableData = res.data;
          this.TimetableData.forEach((element) => {
            element.start_time = element.startTime.substring(11, 16);
            element.end_time = element.endTime.substring(11, 16);
            element.Duration = timeDifference(
              element.start_time,
              element.end_time
            );
            if (Number(element.start_time.substring(0, 2)) >= 12) {
              this.PMtableData.push(element);
            } else {
              this.AMtableData.push(element);
            }
          });
        }
    },
    edit(id) {
      this.$emit("event", id, true);
    },
  },
  watch: {},
};
</script>
<style lang="scss">
.dean_cenetr {
  .m_view {
    margin-bottom: 20px;
    font-size: 13px;
    .mm {
      margin-bottom: 10px;
      span {
        display: inline-block;
        height: 20px;
        width: 45px;
        text-align: center;
        background: #6dd739;
        color: #ffffff;
        line-height: 20px;
        border-radius: 25px;
      }
    }
    .pm {
      span {
        background: #ff7300;
      }
    }
  }
  .Timetable-view {
    min-height: 80px;
    display: flex;
    align-items: center;
    flex-wrap: wrap; /*换行*/
    justify-content: space-between;
    // justify-content: space-around;
    min-width: 380px;
    .Timetable-li {
      width: 45%;
      min-width: 340px;
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding-left: 8px;
      height: 50px;
      line-height: 50px;
      .sk_time {
        font-weight: 600;
        color: #399def;
        margin-right: 8px;
        min-width: 73px;
      }
      .Timetable-text {
        flex: 1;
        min-width: 250px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e1e1e1;
        span {
          margin-right: 10px;
        }
        .bi {
          margin: 0 5px;
        }
      }
    }
  }
  .no_kc {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    .no_kc-view {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      min-width: 300px;
      box-shadow: 0 0 8px 0 #eceef1;
      padding: 0 20px;
      img {
        width: 260px;
        height: 200px;
      }
      p {
        color: #bfbfbf;
        font-weight: 600;
      }
    }
  }
}
</style>