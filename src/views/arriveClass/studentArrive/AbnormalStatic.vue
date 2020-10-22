<template>
  <div id="abnormalStatic">
    <!-- 弹框 -->
    <el-dialog destroy-on-close :title="title" :visible.sync="dialogVisible" width="480px">
      <component @cancel="cancel" @success="success" :id="id" :type="type" :is="currentComponent"></component>
    </el-dialog>

    <div class="_top">
      <el-button v-hasPermi="['system:statistic:addErrorRecord']"  @click.native="add('add-abnormal','添加巡检异常记录')">添加巡检异常记录</el-button>
      <el-button v-hasPermi="['system:statistic:addLeaveRecord']"  @click.native="add('add-leave-record','添加请假记录')">添加请假记录</el-button>
      <div class="_input">
        <el-input @change="change" v-model="name" placeholder="请输入学生姓名/学号搜索">
          <el-button @click.native="change" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>

      <div>
        <span>年级</span>
        <el-select @change="change" v-model="grade">
          <el-option label="全部" value></el-option>
          <el-option v-for="item of gradeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>

      <div>
        <span>班号</span>
        <el-select @change="change" v-model="classNum">
          <el-option label="全部" value></el-option>
          <el-option v-for="item of classList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>

      <div>
        <span>异常情况</span>
        <el-select @change="change" v-model="abnormalType">
          <el-option label="全部" value></el-option>
          <el-option :label="'请假'" :value="'1'"></el-option>
          <el-option :label="'缺课'" :value="'2'"></el-option>
          <el-option :label="'上课时长不足'" :value="'3'"></el-option>
          <el-option :label="'巡检异常'" :value="'4'"></el-option>
        </el-select>
      </div>
    </div>
    <div class="table">
      <el-table :data="arriveAbnormal" border style="width: 100%">
        <el-table-column align="center" prop="showName" label="姓名(学号)"></el-table-column>
        <el-table-column align="center" prop="grade" label="年级"></el-table-column>
        <el-table-column align="center" prop="classNo" label="班号"></el-table-column>
        <el-table-column align="center" prop="listenStatus" label="异常情况">
          <template slot-scope="scope">
            <p v-for="n of scope.row.errorCnt" :key="n">{{'巡检异常'}}</p>
            <p>{{abnormalTypes[scope.row.listenStatus]}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="errorDetail" label="备注详情">
          <template slot-scope="scope">
            <p v-for="(item,index) of remarkDetail(scope.row)" :key="index">{{item||'/'}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程信息">
          <template slot-scope="scope">
            <p>{{scope.row.courseName}}&nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.courseTime}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="本学年异常情况总计">
          <template slot-scope="scope">
            <p>
              <span>{{scope.row.absentCnt?`${scope.row.absentCnt}次缺课，`:''}}</span>
              <span>{{scope.row.notEnoughCnt?`${scope.row.notEnoughCnt}次上课时长不足，`:''}}</span>
              <span>{{scope.row.leaveCnt?`${scope.row.leaveCnt}次请假，`:''}}</span>
              <span>{{scope.row.errorCnt?`${scope.row.errorCnt}次巡检异常`:''}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="noticeParentWay" label="告知家长方式">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.noticeParentWay||'/'}}</span>
              <span
                @click="add('add-parent','编辑文本','1',scope.row.id)"
                 v-hasPermi="['system:statistic:addErrorFeedBack']"
                class="el-icon-edit-outline"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="parentFeedback" label="家长回应">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.parentFeedback||'/'}}</span>
              <span
                @click="add('add-parent','编辑文本','2',scope.row.id)"
                v-hasPermi="['system:statistic:addErrorFeedBack']"
                class="el-icon-edit-outline"
              ></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <div class="pager">
        <span>共{{total}}项</span>
        <el-pagination
          @current-change="pageSkip"
          background
          layout="prev, pager, next"
          :pager-count="5"
          :total="total"
        ></el-pagination>
      </div>

      <el-alert title="上课时长不足：学生在某课程直播间的在线时长比该课预计用时少10分钟时，被系统记录。" type="warning" show-icon></el-alert>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { haveChildMenu } from "@/utils";
export default {
  data() {
    return {
      dialogVisible: false,
      title: "添加巡检异常记录",
      currentComponent: "add-abnormal",
      name: "",
      studentList: [],
      grade: "",
      classNum: "",
      abnormalType: "",
      total: 1,
      currentPage: 1,
      abnormalTypes: {
        "0": "正常",
        "1": "请假",
        "2": "缺课",
        "3": "上课时长不足"
      },
      type: "1",
      id: ""
    };
  },
  computed: {
    ...mapState("student", [
      "historyList",
      "gradeList",
      "classList",
      "arriveAbnormal"
    ]),
  },
  components: {
    "add-abnormal": () => import("./AddAbnormal.vue"),
    "add-leave-record": () => import("./AddLeaveRecord.vue"),
    "add-parent": () => import("./AddParent.vue")
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("student", ["queryGrade", "queryClass", "cntTodayStudent"]),
    ...mapMutations("student", ["SAVE_CLASSS"]),
    initData() {
      this.queryGrade();
      this.queryClass({
        gradeId: ""
      });
      this.query(1);
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
    },
    add(component, name, type, id) {
      this.title = name;
      this.currentComponent = component;
      this.dialogVisible = true;
      type && (this.type = type);
      id && (this.id = id);
    },
    query(page, ...rest) {
      this.cntTodayStudent({
        condition: this.name,
        searchType: "1",
        classNo: this.classNum,
        grade: this.grade,
        listenStatus: this.abnormalType,
        pageNum: page,
        pageSize: 10
      }).then(res => {
        if (res.code == 200) {
          this.total = res.total;
        }
      });
    },
    gradeChange(val) {
      let grade = this.gradeList.find(item => {
        return item.name === val;
      });
      if (grade) {
        this.queryClass({
          gradeId: grade.id
        });
      } else {
        this.queryClass({
          gradeId: ""
        });
      }
    },
    change(val) {
      this.currentPage = 1;
      this.query(1);
    },
    pageSkip(page) {
      this.currentPage = page;
      this.query(page);
    },
    success() {
      this.dialogVisible = false;
      this.initData();
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  watch: {
    grade(val) {
      this.gradeChange(val);
    }
  }
};
</script>

<style lang="scss">
#abnormalStatic {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
#abnormalStatic {
  margin: 20px 0;
  ._top {
    display: flex;
    flex-wrap: wrap;
    & > div {
      margin-right: 20px;
      flex: 1;
      display: flex;
      align-items: center;
      span {
        flex-shrink: 0;
        margin-right: 10px;
      }
      &:nth-child(1) {
        flex: 2;
      }
    }
    ._input {
      flex-basis: 300px;
      flex-grow: 0;
      margin-left: 20px;
    }
  }
  .table {
    margin-top: 20px;
    .el-icon-edit-outline {
      font-size: 20px;
      color: #36ace8;
      cursor: pointer;
    }
  }
  footer {
    margin-top: 10px;
    .pager {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  }
}
</style>
