<template>
  <div class="app-container back-home">
    <div class="back-today">
      <div class="dean-exh-ti">
        <span class="ti-name">今日用量情况</span>
      </div>
      <div class="dean-exh-view">
        <div class="dean-exh-view-kc">
          <div>
            当前使用教室:
            <span>{{useLevel.classRoomNow }}</span>间
          </div>
          <div>
            今日已用教室:
            <span>{{useLevel.classRoomTodayUse}}</span>间
          </div>
        </div>
        <div class="dean-exh-view-kc">
          <div>
            今日仍需教室:
            <span>{{useLevel.classRoomTodayNeed}}</span>间
          </div>
          <div>
            今日已用时长:
            <span>{{useLevel.classTimeTodayUse}}</span>分钟
          </div>
        </div>
        <div class="dean-exh-view-kc">
          <div>
            今日仍需时长:
            <span>{{useLevel.classTimeTodayNeed}}</span>分钟
          </div>
        </div>
      </div>
    </div>
    <div class="back-contran">
      <div class="school-view" v-for="(item,index) in schoolUseLevels" :key="index">
        <div class="school-head">
          <h6>{{item.schoolName}}</h6>
          <div>
            <img :src="require(`../../assets/image/ico_sk${item.type=='0'?'':'z'}.png`)" alt>
            <span :class="item.type=='0'?'active':'now'">{{`${item.type=='0'?'未上课':'上课中'}`}}</span>
          </div>
        </div>
        <div class="school-center">
          <div>
            当前使用教室
            <span>{{item.classRoomNow}}</span>间
          </div>
          <div>
            今日已用教室
            <span>{{item.classRoomTodayUse}}</span>间
          </div>
          <div>
            今日仍需教室
            <span>{{item.classRoomTodayNeed}}</span>间
          </div>
          <div>
            今日已用时长
            <span>{{item.classTimeTodayUse}}</span>分钟
          </div>
          <div>
            今日仍需时长
            <span>{{item.classTimeTodayNeed}}</span>分钟
          </div>
        </div>
        <div class="tishi">
          <img src="../../assets/image/tishi.png" alt>
          <span>课程结束后计入已用时长</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { today } from "@/utils";
export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapState("home", ["useLevel",'schoolUseLevels'])
  },
  methods: {
    ...mapActions("home", ["homePage"]),
    initData() {
      this.homePage({
        type: "1",
        date: today(new Date()).split(" ")[0]
      });

      this.homePage({
        type: "2",
        date: today(new Date()).split(" ")[0]
      });
    }
  },
  created() {
    this.initData();
  }
};
</script>
<style lang="scss" scoped>
.back-home {
  .back-today {
    height: 120px;
    min-width: 1000px;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 2px 5px 0px #eceef1;
    padding-left: 10px;
    font-weight: 600;
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    background: url("../../assets/image/bg_jwgl.png") no-repeat 100% 100%;
    background-position: right;
    .dean-exh-bg {
      position: absolute;
      top: 0;
      right: 15px;
      height: 133px;
    }
    .dean-exh-ti {
      height: 40px;
      display: flex;
      align-items: center;
      .ti-name {
        margin-right: 15px;
        font: 17px;
      }
      .ti-text {
        line-height: 20px;
        color: #666666;
        font-size: 13px;
      }
    }
    .dean-exh-view {
      flex: 1;
      display: flex;
      align-items: center;
      .dean-exh-view-kc {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666666;
        width: 25%;
        min-width: 300px;
        box-sizing: border-box;
        border-right: 1px solid #a1cef4;
        font-size: 13px;
        div:nth-child(1) {
          margin-right: 30px;
        }
        span {
          font-size: 24px !important;
          padding: 0 3px;
          color: #3a9def;
          //   font-family: Microsoft Yahei;
          font-family: "FangSong";
          font-weight: 900 !important;
        }
      }
      .dean-exh-view-kc:last-child {
        border-right: 0px solid #a1cef4;
      }
    }
  }
  .back-contran {
    display: flex;
    flex-wrap: wrap;
    .school-view {
      width: 320px;
      height: 200px;
      border: 1px solid #eceef1;
      box-shadow: 0px 2px 5px 0px #eceef1;
      margin: 10px;
      box-sizing: border-box;
      padding: 10px 15px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      .school-head {
        height: 30px;
        border-bottom: 1px solid #eceef1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        div {
          display: flex;
          align-items: center;
          height: 16px;
          line-height: 16px;
          .active {
            color: #44a1ef;
          }
          .now {
            color: #f59a23;
          }
        }
        img {
          height: 14px;
          margin: 0 3px;
        }
      }
      .school-center {
        flex: 1;
        div {
          width: 50%;
          height: 36px;
          float: left;
          display: flex;
          justify-items: flex-end;
          color: #666666;
          display: flex;
          align-items: flex-end;
          span {
            font-size: 20px;
            padding: 0 2px;
            font-weight: 700;
            margin-bottom: -2px;
            font-family: "FangSong";
          }
        }
        div:last-child {
          width: 70%;
        }
      }
      .tishi {
        height: 24px;
        display: flex;
        align-items: center;
        color: #f59a23;
        span {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>