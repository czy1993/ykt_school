<template>
  <div class="app-container dean">
    <div class="dean-header">
      教务管理
      <span>{{`(${stage.semester} ${stage.season}学期 第${stage.week}周)`}}</span>
    </div>
    <div class="dean-exh">
      <!-- <img class="dean-exh-bg" src="../../../assets/image/bg_jwgl.png" alt /> -->
      <div class="dean-exh-ti">
        <span class="ti-name">排课用量</span>
        <span class="ti-text">(建议排课时预留部分余量，以免用量不足强制关闭直播室，如需扩大用量，请联系佰讯公司)</span>
      </div>
      <div class="dean-exh-view">
        <div class="dean-exh-view-kc">
          <div>
            额定教室:
            <span>{{classroom.classRoomNum}}</span>间
          </div>
          <div>
            剩余教室:
            <span>{{classroom.residueClassRoomNum}}</span>间
          </div>
        </div>
        <div class="dean-exh-view-kc">
          <div>
            临时教室:
            <span>{{classroom.temRoomNum}}</span>间
          </div>
          <div>
            剩余教室:
            <span>{{classroom.residueTemRoomNum}}</span>间
          </div>
        </div>
      </div>
    </div>
    <div class="dean-container">
      <div class="dean-container-left">
        <DeanLeft></DeanLeft>
      </div>
      <div class="dean-container-right">
        <DeanRight></DeanRight>
      </div>
    </div>
  </div>
</template>
<script>
import DeanRight from "./components/dean_right";
import DeanLeft from './components/dean_left';
import { courseFlow } from '@/api/teacher.js'
export default {
  components: {
    DeanRight,
    DeanLeft
  },
  data() {
    return {
      stage: {
        semester: "2020-2021",
        week: "1",
        season: "秋季",
      },
      classroom:{}
    };
  },
  created(){
    this.get_courseFlow()
  },
  methods:{
    get_courseFlow(){
      courseFlow().then( res => {
        if(res.code == 200){
          this.classroom = res.data;
        }
      })
    }
  }
};
</script>
<style lang="scss" >
.dean {
  .dean-header {
    height: 50px;
    font-size: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    padding-left: 10px;
    margin-bottom: 8px;
    font-weight: 600;
    span {
      line-height: 20px;
      margin-left: 6px;
      font-size: 13px;
      color: #666666;
    }
  }
  .dean-exh {
    height: 120px;
    min-width: 1000px;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    padding-left: 50px;
    font-weight: 600;
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    background: url("../../../assets/image/bg_jwgl.png") no-repeat 100% 100%;
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
        color: #999999;
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
        color: #999999;
        width: 380px;
        box-sizing: border-box;
        border-right: 1px solid #a1cef4;

        div:nth-child(1) {
          margin-right: 30px;
        }
        span {
          font-size: 20px;
          padding: 0 7px;
          color: #3a9def;
        }
      }
      .dean-exh-view-kc:last-child {
        border-right: 0px solid #a1cef4;
      }
    }
  }
  .dean-container {
    min-height: 600px;
    display: flex;
    .dean-container-left {
      flex: 1;
      min-width: 800px;
      box-shadow: 0px 0px 7px 0px #eceef1;
      margin-right: 15px;
      box-sizing: border-box;
      padding: 15px;
    }
    .dean-container-right {
      width: 320px;
      min-width: 320px;
      box-shadow: 0px 0px 7px 0px #eceef1;
      box-sizing: border-box;
      padding: 15px;
    }
  }
}
</style>