<template>
  <div class="room-data2">
    <div class="data2-v bor-shadow">
      <div class="data-from">
        <div class="from-name">单日教室用量(单位：间)</div>
        <div class="from-right">
          <div class="color-v">
            <span class="Used"></span>
            已用
          </div>
          <div class="color-v">
            <span class="surplus"></span>
            任需
          </div>
          <el-date-picker
            class="date-picker"
            v-model="date1"
            @change="get_homePage(date1)"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="data-echart">
        <div class="echart-v">
          <div class="v-1" :style="{width:roomData1.roomBili+'%'}">{{roomData1.classRoomTodayUse}}</div>
          <div class="v-2">{{roomData1.classRoomTodayNeed}}</div>
        </div>
      </div>
    </div>
    <div class="data2-v bor-shadow">
      <div class="data-from">
        <div class="from-name">单日时长用量(单位：分钟)</div>
        <div class="from-right">
          <div class="color-v">
            <span class="Used"></span>
            已用
          </div>
          <div class="color-v">
            <span class="surplus"></span>
            任需
          </div>
          <el-date-picker
            class="date-picker"
            v-model="date1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="data-echart">
        <div class="echart-v">
          <div class="v-1" :style="{width:roomData1.timeBili+'%'}">{{roomData1.classTimeTodayUse}}</div>
          <div class="v-2">{{roomData1.classTimeTodayNeed}}</div>
        </div>
      </div>
    </div>
    <div class="data2-v bor-shadow">
      <div class="data-from">
        <div class="from-name">教室用量(单位：间)</div>
        <div class="from-right">
          <div class="color-v">
            <span class="Used"></span>
            已用({{roomData.classRoomTodayUse}})
          </div>
          <div class="color-v">
            <span class="surplus"></span>
            任需({{roomData.classRoomTodayNeed}})
          </div>
        </div>
      </div>
      <div class="data-echart">
        <div class="echart-v">
          <div class="v-1" :style="{width:''+roomData.roomBili+'%'}">{{roomData.classRoomTodayUse}}</div>
          <div class="v-2">{{roomData.classRoomTodayNeed}}</div>
        </div>
      </div>
    </div>
    <div class="data2-v bor-shadow">
      <div class="data-from">
        <div class="from-name">时长用量(单位：分钟)</div>
        <div class="from-right">
          <div class="color-v">
            <span class="Used"></span>
            已用({{roomData.classTimeTodayUse}})
          </div>
          <div class="color-v">
            <span class="surplus"></span>
            任需({{roomData.classTimeTodayNeed}})
          </div>
        </div>
      </div>
      <div class="data-echart">
        <div class="echart-v">
          <div class="v-1" :style="{width:''+roomData.timeBili+'%'}">{{roomData.classTimeTodayUse}}</div>
          <div class="v-2">{{roomData.classTimeTodayNeed}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { today, deepCopy } from "@/utils/index.js";
import { homePage } from "@/api/backstage.js";
export default {
  props: {
    schoolId: Number,
    // roomData: Object,
  },
  data() {
    return {
      date1: today(new Date()),
      userWatch: {
        width: "50%",
      },
      roomData1: {},
      roomData:{}
    };
  },
  created() {
    this.get_homePage()
    this.get_homePage(this.date1)
  },
  methods: {
    get_homePage(date) {
      let data = `type=2&date=${date}&schoolId=${this.schoolId}`;
      homePage(data).then((res) => {
        if (res.code == 200) {
          if(!date){
            this.roomData = res.data;
            this.roomData.roomBili = (Number(this.roomData.classRoomTodayUse)/(Number(this.roomData.classRoomTodayUse) + Number(this.roomData.classRoomTodayNeed)))*100;
            this.roomData.timeBili = (Number(this.roomData.classTimeTodayUse)/(Number(this.roomData.classTimeTodayNeed) + Number(this.roomData.classTimeTodayUse)))*100;
          }else{
            this.roomData1 = res.data;
            this.roomData1.roomBili = (Number(this.roomData1.classRoomTodayUse)/(Number(this.roomData1.classRoomTodayUse) + Number(this.roomData1.classRoomTodayNeed)))*100;
            this.roomData1.timeBili = (Number(this.roomData1.classTimeTodayUse)/(Number(this.roomData1.classTimeTodayNeed) + Number(this.roomData1.classTimeTodayUse)))*100;
          }
          
        }
      });
    },
    dataDeep(data, index) {
      let objs = deepCopy(data);
      if (index == "1") {
        objs.total = objs.
        objs.proportion;
      }
      objs.total = objs.proportion;
    },
  },
};
</script>
<style lang="scss" scoped>
.room-data2 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .data2-v {
    width: 49%;
    min-width: 480px;
    height: 140px;
    box-sizing: border-box;
    padding: 15px 30px;
    .data-from {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .from-name {
        font-size: 15px;
        color: #000000;
        font-weight: 600;
      }
      .from-right {
        display: flex;
        align-items: center;
        .date-picker {
          width: 140px;
        }
        .color-v {
          margin: 0 12px;
          display: flex;
          align-items: center;
          span {
            height: 12px;
            width: 12px;
            margin: 4px;
          }
          .Used {
            background: #17509d;
          }
          .surplus {
            background: #3a9def;
          }
        }
      }
    }
    .data-echart {
      padding-top: 25px;
      .echart-v {
        display: flex;
        align-items: center;
        height: 30px;
        width: 100%;
        div {
          height: 30px;
          text-align: center;
          line-height: 30px;
          text-align: center;
          font-size: 20px;
          color: #ffffff;
        }
        .v-1 {
          background: #17509d;
        }
        .v-2 {
          flex: 1;
          background: #3a9def;
        }
      }
    }
  }
}
</style>