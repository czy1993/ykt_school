<template>
  <div class="room-data1 bor-shadow">
    <div class="data1-v">
      <div class="data1-view">
        <div>
          <p>
            总计教室：
            <span>{{roomData.classRoomTotal==null?0:roomData.classRoomTotal}}</span>间
          </p>
          <p>
            总计时长：
            <span>{{roomData.classTimeTotal==null?0:roomData.classTimeTotal}}</span>分钟
          </p>
        </div>
        <span class="dates"></span>
      </div>
      <div class="data1-view">
        <div>
          <p>
            额定教室：
            <span>{{roomData.classRoomNum==null?0:roomData.classRoomNum}}</span>间
          </p>
          <p>
            额定时长：
            <span>{{roomData.classTimeNum==null?0:roomData.classTimeNum}}</span>分钟
            <span
              class="buts"
              size="mini"
              type="text"
              v-show="schoolId!=''"
              @click="openLoad('ed')"
            >修改</span>
          </p>
        </div>
        <span class="dates"></span>
      </div>
      <div class="data1-view">
        <div>
          <p>
            临时教室：
            <span>{{roomData.temRoomNum==null?0:roomData.temRoomNum}}</span>间
          </p>
          <p>
            临时时长：
            <span>{{roomData.temTimeNum==null?0:roomData.temTimeNum}}</span>分钟
            <span
              class="buts"
              size="mini"
              type="text"
              v-show="schoolId!=''"
              @click="openLoad('ls')"
            >修改</span>
          </p>
        </div>

        <span class="dates">有效期至：{{roomData.useStopTime}}</span>
      </div>
    </div>
    <!-- <div class="data1-v">
        <div class="data1-view">
          <div>
            <p>
              总计教室：
              <span>4000</span>间
            </p>
            <p>
              总计时长：
              <span>623132154</span>分钟
            </p>
          </div>
          <span class="dates">有效期至：2020-12-12 24:00:00</span>
        </div>
        <div class="data1-view">
          <div>
            <p>
              额定教室：
              <span>3500</span>间
            </p>
            <p>
              额定时长：
              <span>621231523</span>分钟
              <el-button class="buts" size="mini" type="text">添加</el-button>
            </p>
          </div>
          <span class="dates">有效期至：2020-12-12 24:00:00</span>
        </div>
        <div class="data1-view"></div>
    </div>-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="dialog-view">
        <div class="dialog-from">
          <span class="from-name">{{type=='1'?'额定':'临时'}}教室(单位:间)</span>
          <el-input
            class="from-val"
            v-model="classRoomTotal"
            min="0"
            type="number"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div class="dialog-from">
          <span class="from-name">{{type=='1'?'额定':'临时'}}时长(单位:分钟)</span>
          <el-input
            class="from-val"
            v-model="classTimeTotal"
            min="0"
            type="number"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div class="dialog-from" v-show="type=='2'">
          <span class="from-name">临时用量有效期</span>
          <el-date-picker
            class="from-val"
            v-model="date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="get_updateUseTotal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateUseTotal } from "@/api/backstage.js";
import { nextYear } from "@/utils/index.js";
export default {
  props: {
    schoolId:Number,
    roomData: Object,
  },
  data() {
    return {
      dialogVisible: false,
      title: "修改额定配置",
      type: "1",
      classRoomTotal: "",
      classTimeTotal: "",
      date: nextYear(),
    };
  },
  methods: {
    handleClose(done) {
      done();
    },
    openLoad(name) {
      if (name == "ed") {
        this.classRoomTotal = Number(this.roomData.classRoomNum);
        this.classTimeTotal = Number(this.roomData.classTimeNum);
      } else {
        this.classRoomTotal = Number(this.roomData.temRoomNum);
        this.classTimeTotal = Number(this.roomData.temRoomNum);
      }
      this.title = name == "ed" ? "修改额定配置" : "修改临时配置";
      this.type = name == "ed" ? "1" : "2";
      this.dialogVisible = true;
    },
    get_updateUseTotal() {
      let data = `classRoomTotal=${this.classRoomTotal}
      &classTimeTotal=${this.classTimeTotal}&schoolId=${this.schoolId}&type=${this.type}&date=${this.type=='1'?'':this.date}`;
      updateUseTotal(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
            onClose: () => {
              this.dialogVisible = false;
              this.$parent.get_useTotal();
            },
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  watch: {
    dialogVisible(val) {
      if (val == false) {
        this.classRoomTotal = "";
        this.classTimeTotal = "";
      }
    },
  },
};
</script>
<style lang="scss">
.room-data1 {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 5px 10px;
  font-size: 13px;
  color: #666666;
  .data1-v {
    display: flex;
    min-height: 80px;
    border-bottom: 1px solid #cccccc;
    .data1-view {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      // align-items: center;
      justify-content: center;
      // padding-left: 5%;
      div {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        p {
          padding: 0 5px;
          display: flex;
          align-items: flex-end;
          span {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: -2px;
            font-family: "MicrosoftYaHei";
          }
          .buts {
            margin-left: 15px;
            font-size: 13px;
            color: #46a1ef;
            margin-bottom: 1px;
            font-weight: 500;
            cursor: pointer;
          }
        }
      }
    }
    .dates {
      padding: 0 5px;
      height: 22px;
      line-height: 22px !important;
      color: #aeaeae;
    }
  }
  .data1-v:last-child {
    border-bottom: 0px solid #cccccc;
  }
  .dialog-view {
    min-height: 160px;
    box-sizing: border-box;
    padding: 20px;
    .dialog-from {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .from-name {
        width: 130px;
        color: #000000;
        font-weight: 700;
      }
      .from-val {
        flex: 1;
      }
    }
  }
}
</style>