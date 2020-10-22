<template>
  <div id="arriveDetail">
    <div class="arr_top">
      <div class="_top_one">
        <span>选择班级</span>
        <div>
          <span>年级</span>
          <el-select placeholder="请选择年级" @change="gradeChange" v-model="grade">
            <el-option
              v-for="(item,index) of gradeClassNo"
              :key="index"
              :value="item.name"
            >{{item.name}}</el-option>
          </el-select>

          <span>班号</span>
          <el-select @change="classChange" placeholder="请选择班号" v-model="classNo">
            <el-option
              v-for="(item,index) of classList"
              :key="`class_${index}`"
              :value="item"
            >{{item}}</el-option>
          </el-select>
        </div>
      </div>
      <div class="_top_two">
        <span>选择学生</span>
        <div v-if="studentList.length>0">
          <el-radio-group @change="changeRadio" v-model="student">
            <el-radio-button
              v-for="(student,index) of studentList"
              :key="student.id"
              :label="index"
            >{{student.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <p v-else>无</p>
      </div>
    </div>
    <div v-loading="loading" class="arr_table">
      <h3>
        {{studentList[student]&&`${studentList[student].name}（${studentList[student].stuNo}）`||'***'}}
        <span
          class="segmentation"
        >|</span>
        <p>
          到课率
          <i>{{arriveRate||0.00}}%</i>，认真率
          <i>{{earnestRate||0.00}}%</i>
          <span>/</span>缺课
          <i>{{arriveDetail[0]&&arriveDetail[0].absentCnt||0}}</i>次，请假
          <i>{{arriveDetail[0]&&arriveDetail[0].leaveCnt||0}}</i>次，巡检异常
          <i>{{arriveDetail[0]&&arriveDetail[0].errorCnt||0}}</i>次，上课时长不足
          <i>{{arriveDetail[0]&&arriveDetail[0].notEnoughCnt||0}}</i>次&nbsp;&nbsp;&nbsp;&nbsp;到课
          <i>{{arriveNum ||0}}</i>次，正常上课
          <i>{{normalNum||0}}</i>次，异常上课
          <i>{{arriveNum-normalNum}}</i>次
        </p>
      </h3>
      <div class="_table">
        <div class="_search">
          <span>上课情况</span>
          <el-select @change="changeType" v-model="abnormalValue" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option :label="'正常'" :value="'0'"></el-option>
            <el-option :label="'请假'" :value="'1'"></el-option>
            <el-option :label="'缺课'" :value="'2'"></el-option>
            <el-option :label="'上课时长不足'" :value="'3'"></el-option>
            <el-option :label="'巡检异常'" :value="'4'"></el-option>
          </el-select>
        </div>

        <el-table :data="arriveDetail" border style="width: 100%">
          <el-table-column align="center" prop="today" label="日期"></el-table-column>
          <el-table-column align="center" prop="courseTime" label="时间"></el-table-column>
          <el-table-column align="center" prop="courseName" label="课程"></el-table-column>
          <el-table-column align="center" prop="listenStatus" label="上课情况">
            <template slot-scope="scope">
              <p v-for="n of scope.row.errorCnt" :key="n">{{'巡检异常'}}</p>
              <p>{{abnormalTypes[scope.row.listenStatus]}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="errorDetail" label="异常备注">
            <template slot-scope="scope">
              <p v-for="(item,index) of remarkDetail(scope.row)" :key="index">{{item||'/'}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="courseMessage" label="告知家长方式">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.noticeParentWay||'/'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="parentFeedback" label="家长回应">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.parentFeedback||'/'}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <footer>
        <span>共{{total}}项</span>
        <el-pagination
          @current-change="pageSkip"
          background
          layout="prev, pager, next"
          :pager-count="5"
          :total="total"
        ></el-pagination>
      </footer>
    </div>
    <!-- <div class="_tip" v-else>暂无数据</div> -->
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      grade: "",
      loading: false,
      classNo: "",
      classList: [],
      student: 0,
      abnormalValue: "",
      currentPage: 1,
      abnormalTypes: {
        "0": "正常",
        "1": "请假",
        "2": "缺课",
        "3": "上课时长不足"
      },
      arriveNum: 0, //到课数
      total: 0,
      normalNum: 0 //正常上课次数
    };
  },
  computed: {
    ...mapState("student", [
      "studentList",
      "gradeClassNo",
      "courseList",
      "arriveDetail"
    ]),
    arriveRate() {
      if (this.total) {
        return ((this.arriveNum / this.total) * 100).toFixed(2);
      } else {
        return (0).toFixed(2);
      }
    },
    earnestRate() {
      if (this.arriveNum) {
        return ((this.normalNum / this.arriveNum) * 100).toFixed(2);
      } else {
        return (0).toFixed(2);
      }
    }
  },
  created() {
    this.initData();
  },
  components: {
    "tag-group": () => import("./tag-group.vue"),
    tag: () => import("./tag.vue")
  },
  methods: {
    ...mapActions("student", [
      "queryStudentByCondition",
      "getGradeCascadeClassNo",
      "queryCourseByStudent",
      "cntStudentDetail"
    ]),
    initData() {
      this.getGradeCascadeClassNo({ pageType: "2" });
    },
    gradeChange(val) {
      this.classNo = "";
      for (let grade of this.gradeClassNo) {
        if (grade.name === val) {
          return void (this.classList = grade.classList);
        }
      }
    },
    classChange() {
      this.queryStudentByCondition({
        grade: this.grade,
        classNo: this.classNo,
        pageType: "2"
      }).then(() => {
        this.student = 0;
        this.query(1);
      });
    },
    changeType(val) {
      this.query(1);
    },
    query(page) {
      this.loading = true;
      if (this.studentList.length > 0) {
        this.cntStudentDetail({
          listenMember: this.studentList[this.student].stuNo,
          pageNum: page,
          pageSize: 10,
          schoolId: this.studentList[this.student].schoolId,
          listenStatus: this.abnormalValue
        })
          .then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.total = res.total;
              this.normalNum = (res.rows[0] && res.rows[0].normalCnt) || 0;
              this.arriveNum =
                res.total - (res.rows[0] && res.rows[0].absentCnt) || 0;
            } else {
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
          });
      }else{
         this.loading = false;
      }
    },
    changeRadio(val) {
      this.query(1);
    },
    pageSkip(page) {
      this.currentPage = page;
      this.query(page);
    },
    remarkDetail(obj) {
      if (obj.errorDetail) {
        let arr = obj.errorDetail.split(";"),
          num = 0;
        if (obj.listenStatus == "0") {
          num = 1;
        }
        if (
          obj.leaveCnt +
            obj.absentCnt +
            obj.notEnoughCnt +
            obj.errorCnt +
            num ===
          arr.length
        ) {
          return arr;
        } else {
          arr.pop();
          return arr;
        }
      } else {
        return [""];
      }
    }
  }
};
</script>

<style lang="scss">
#arriveDetail {
  ._top_two {
    .el-radio-group {
      label {
        margin: 10px 10px;
        .el-radio-button__inner {
          border: 1px solid #dcdfe6;
          border-radius: 0;
          box-shadow: none;
        }
      }
    }
  }
}
</style>




<style lang="scss" scoped>
#arriveDetail {
  margin: 20px 0;
  .arr_top {
    padding: 10px;
    background-color: #f7f7f7;

    ._top_one {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #dbdbdb;
      & > span {
        margin-right: 30px;
        flex-shrink: 0;
      }
      & > div > span {
        margin-right: 10px;
        color: #656565;
      }
      & > div {
        span:nth-of-type(2) {
          margin-left: 30px;
        }
      }
    }
    ._top_two {
      display: flex;
      // align-items: flex-start;
      margin-top: 20px;
      & > span {
        margin-top: 20px;
        flex-shrink: 0;
        margin-right: 20px;
      }
      p {
        display: flex;
        align-items: flex-end;
      }
    }
  }
  .arr_table {
    margin-top: 30px;
    h3 {
      font-size: 16px;
      display: flex;
      align-items: center;
      span {
        margin: 0 20px;
      }
      i {
        font-style: normal;
        color: #3a9def;
      }
      .segmentation {
        color: #9bb5d7;
      }
      p {
        font-weight: 600;
        font-size: 14px;
      }
    }
    ._table {
      margin-top: 20px;
      ._search {
        margin-bottom: 10px;
        span {
          margin-right: 10px;
        }
      }
      .abnormals {
        display: flex;
        align-items: center;
        span {
          flex-shrink: 0;
          margin-right: 10px;
        }
      }
    }
  }
  ._tip {
    text-align: center;
    font-size: 20px;
    padding: 30px;
    color: #d3d3d3;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }
}
</style>
