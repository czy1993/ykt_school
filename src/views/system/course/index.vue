<template>
  <div class="app-container course">
    <div class="course-header">课程录像</div>
    <div class="course-from">
      <el-select v-model="gradeId" @change="get_queryClass" placeholder="年级">
        <el-option v-for="item in gradeArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="classValue" @change="get_allVideo" placeholder="班级">
        <el-option v-for="item in classArr" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <el-button type="primary" :disabled="ids==''?true:false" @click="open">批量删除</el-button>
    </div>
    <div class="lxData-view" v-if="lxData.length > 0">
      <div class="lxData-li" v-for="(item,index) in lxData" :key="index" >
        <div class="play" @click="goRoom(item)">
          <i class="el-icon-caret-right"></i>
        </div>

        <div @click="statusEdit(index)" :class="['status',item.status==true?'status-active':'']">
          <img src="@/assets/icon/active.png" alt>
        </div>
        <img class="kc-logo" :src="require(`@/assets/kc_img/${item.imgUrl}.jpg`)" alt>
        <div class="kc-view">
          <div class="kc-name">{{item.name}}</div>
          <div>
            <span>录制日期：</span>
            {{item.date}}
          </div>
          <div>
            <span>录制时长：</span>
            {{item.time}}
          </div>
          <div>
            <span>录像编号：</span>
            {{item.id}}
          </div>
        </div>
      </div>
    </div>
    <div class="lxData-no" v-else>
      <div>
        <img src="@/assets/image/wucopy.png" alt>
        <span>暂无录像</span>
      </div>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { queryGrade, queryClass } from "@/api/index.js";
import { allVideo, deleteVideo } from "@/api/teacher.js";
import { deepCopy } from "@/utils/index.js";
import { roomUrl } from "@/utils/env";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      gradeArr: [],
      gradeId: "",
      gradeName: "",
      classArr: [],
      classValue: "",
      lxData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      ids: ""
    };
  },
  created() {
    this.get_queryGrade();
  },
  methods: {
    get_queryGrade() {
      queryGrade().then(res => {
        if (res.code == 200) {
          this.gradeArr = res.data;
          this.gradeId = res.data[0].id;
          this.get_queryClass();
        }
      });
    },
    get_queryClass() {
      this.query_GradeName();
      queryClass(this.gradeId).then(res => {
        if (res.code == 200) {
          this.classArr = res.data;
          this.classValue = res.data[0].name;
          this.get_allVideo();
        }
      });
    },
    // 根据年级id查名称
    query_GradeName() {
      this.gradeArr.forEach(element => {
        if (this.gradeId == element.id) {
          this.gradeName = element.name;
        }
      });
    },
    get_allVideo() {
      let data = `className=${this.classValue}&gradeName=${
        this.gradeName
      }&pageNum=${this.pageNum}&pageSize=${this.pageSize}`;
      allVideo(data).then(res => {
        if (res.code == 200) {
          this.lxData = res.rows;
          this.lxData.forEach(element => {
            element.status = false;
          });
          this.total = res.total;
        }
      });
    },
    // 选择
    statusEdit(index) {
      let data = deepCopy(this.lxData);
      let ids = [];
      data[index].status = !data[index].status;
      data.forEach(element => {
        if (element.status == true) {
          ids.push(element.id);
        }
      });
      this.ids = ids.join(",");
      this.lxData = data;
    },
    open() {
      this.$confirm("此操作将永久删除选中录像, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteVideo({
          ids: this.ids
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
              onClose: () => {
                this.get_allVideo();
              }
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.get_allVideo();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.get_allVideo();
    },
    goRoom(course) {
      let params = {
        token: getToken(),
        trandsId: course.id,
        roleType: "1"
      };
      params = window.btoa(JSON.stringify(params));
      window.open(roomUrl+'/replay' + `?params=` + params);
    }
  }
};
</script>
<style lang="scss" scoped>
.course {
  .course-header {
    height: 55px;
    font-size: 17px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    padding-left: 10px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .lxData-view {
    padding: 15px 10px;
    min-height: 400px;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    .lxData-li {
      width: 300px;
      box-sizing: border-box;
      padding: 4px;
      margin: 15px;
      border-radius: 5px;
      border: 1px solid #eeeeee;
      position: relative;
      .play {
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        height: 165px;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        cursor: pointer;
        i {
          font-size: 45px;
          color: #fff;
        }
      }
      &:hover {
        box-shadow: 1px 1px 9px 1px rgb(172, 172, 172);
      }
      .kc-logo {
        width: 290px;
        border-radius: 5px;
      }
      .kc-view {
        div {
          padding: 4px 3px;
          color: #666;
        }
      }
      .kc-name {
        font-weight: 700;
      }
      .status {
        position: absolute;
        top: 10px;
        left: 10px;
        height: 25px;
        width: 25px;
        border-radius: 13px;
        background: #ffffff;
        border: 1px solid #eceef1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        img {
          width: 18px;
        }
      }
      .status-active {
        background: #ff7300;
        border-color: #ff7300;
      }
    }
  }
  .lxData-no {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 20px;
    div {
      height: 200px;
      width: 100%;
      border-radius: 4px;
      border: 1px solid #eceef1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      span {
        padding: 10px;
        font-weight: 700;
        color: #bfbfbf;
      }
    }
  }
}
</style>