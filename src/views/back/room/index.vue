<template>
  <div class="app-container room">
    <div class="room-deader bor-shadow">
      <div class="yl-view-li">
        <div>
          <span class="room-name">学校用量:</span>
          <span class="room-text"></span>
        </div>
        <div>
          <span class="room-number">{{roomData.schoolNum}}</span>
          <span class="room-text Company">间</span>
        </div>
      </div>
      <div class="yl-view-li">
        <div>
          <span class="room-name">教室总用量:</span>
          <span class="room-text">(含临时教室)</span>
        </div>
        <div>
          <span class="room-number">{{roomData.classRoomTotal==null?0:roomData.classRoomTotal}}</span>
          <span class="room-text Company">间</span>
        </div>
      </div>
      <div class="yl-view-li">
        <div>
          <span class="room-name">时长总用量:</span>
          <span class="room-text">(含临时时长)</span>
        </div>
        <div>
          <span class="room-number">{{roomData.classTimeTotal==null?0:roomData.classTimeTotal}}</span>
          <span class="room-text Company">分钟</span>
        </div>
      </div>
    </div>
    <div class="room-school bor-shadow">
      <div class="room-school-view">
        <span>学校用量</span>
        <el-select v-model="schoolId" size="mini" @change="schoolEcah" placeholder="选择学校">
          <el-option v-for="item in school" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <router-link class="links" to="/a/back/detaild">用量明细</router-link>
        <router-link class="links" to="/a/back/match">用量配置记录</router-link>
      </div>
      <div class="room-school-view">
        <div v-if="roomData.useType=='1'" class="openType">
          <img src="../../../assets/image/ico_wkf.png" alt />
          <span @click="openShow=true">未开放</span>
          <div v-show="openShow" class="openView">
            <h2>{{`确定开放${schoolName}用量？`}}</h2>
            <p>有效期为即日起1年</p>
            <p>到期时间：{{nextYear}}</p>
            <div>
              <el-button size="mini" @click="openShow=false">取消</el-button>
              <el-button size="mini" type="primary" @click="get_openFlow">确定</el-button>
            </div>
            <div class="titl">
              <img src="../../../assets/image/alert.png" alt />
              <span>注：确认开放后，到期时间之前无法暂停</span>
            </div>
          </div>
        </div>
        <div v-else-if="roomData.useType=='2'" class="openType">
          <img src="../../../assets/image/ico_skz.png" alt />
          <span>使用中</span>
          <span class="operator">{{`(开放操作人：${roomData.flowOpenBy==null?'系统':roomData.flowOpenBy})`}}</span>
        </div>
      </div>
    </div>
    <RoomD1 :roomData="roomData" :schoolId="Number(schoolId)"></RoomD1>
    <RoomD2  ref="roomD2"  v-if="roomData.useType=='2'" :schoolId="Number(schoolId)" :roomData="roomData"></RoomD2>
  </div>
</template>
<script>
import {
  useTotal,
  queryUseDetail,
  schoolMenu,
  openFlow,
} from "@/api/backstage.js";
import { selectAllSchool } from "@/api/system/role.js";
import { exportExcel } from "@/utils/exportExcel.js";
import RoomD1 from "./component/room-d1";
import RoomD2 from "./component/room-d2";
import { nextYear,today } from "@/utils/index.js";
export default {
  components: {
    RoomD1,
    RoomD2,
  },
  data() {
    return {
      school: [],
      schoolId: "",
      schoolName: "",
      value1: "",
      roomData: {},
      openShow: false,
      nextYear: nextYear(),
    };
  },
  created() {
    this.get_selectAllSchool();
    this.get_useTotal();
  },
  methods: {
    get_selectAllSchool() {
      selectAllSchool().then((res) => {
        if (res.code == 200) {
          this.school = res.data;
        }
      });
    },
    get_useTotal() {
      let that = this;
      let data = `schoolId=${that.schoolId}`;
      
      useTotal(data).then((res) => {
        if (res.code == 200) {
          that.roomData = res.data;
          if(that.roomData.useType == '2'){
            setTimeout(()=>{
              that.$refs.roomD2.get_homePage();
              that.$refs.roomD2.get_homePage(today(new Date()))
            },100)
            
          }
        }
      });
    },
    schoolEcah(val) {
      this.school.forEach((element) => {
        if (element.id == val) {
          this.schoolName = element.name;
        }
      });
      this.get_useTotal();
      
      
    },
    get_openFlow() {
      let data = `openType=2&schoolId=${this.schoolId}`;
      openFlow(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "成功",
            type: "success",
            onClose:()=>{
              this.get_useTotal();
            }
          });
        }else{
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.room {
  .room-deader {
    height: 120px;
    display: flex;
    align-items: center;
    background: url("../../../assets/image/bg_jwgl.png") no-repeat 100% 100%;
    background-position: right center;

    .yl-view-li {
      width: 27%;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #a1cef4;
      div {
        min-width: 40%;
        .room-name {
          color: #000000;
          font-size: 14px;
        }
        .room-text {
          font-size: 10px;
          color: #46a1ef;
        }
        .room-number {
          font-size: 20px;
          color: #46a1ef;
          font-weight: 700;
        }
        .Company {
          color: #999999;
        }
      }
    }
    .yl-view-li:last-child {
      border-right: 0px solid #a1cef4;
    }
  }
  .room-school {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 15px;
    font-size: 15px;
    .room-school-view {
      display: flex;
      align-items: center;
      * {
        margin: 0 4px;
      }
      .links {
        font-size: 15px;
        color: #399def;
      }
    }
    .room-school-view:last-child {
      color: #f59a23;
      * {
        margin: 0 1px;
      }
      .openType {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        .operator {
          padding: 4px;
          font-size: 13px;
        }
        .openView {
          position: absolute;
          top: 30px;
          right: 0;
          height: 220px;
          width: 400px;
          background: #ffffff;
          box-shadow: 0px 0 3px 2px #c0c0c0;
          box-sizing: border-box;
          padding: 30px 0;
          z-index: 3;
          color: #666666;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          h2 {
            color: #000000;
            margin-bottom: 8px;
            font-size: 16px;
          }
          p {
            font-size: 13px;
          }
          .titl {
            color: #ff6a00;
            font-size: 13px;
          }
          .el-button {
            width: 120px;
          }
        }
      }
    }
  }
}
</style>
