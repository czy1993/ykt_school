<template>
  <div id="teacherArrive">
    <header>
      <!-- <el-row>
        <el-col :span="6">
          <el-input @change="change" v-model="name" placeholder="请输入教师姓名 / 工号搜索">
            <el-button @click.native="change" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-date-picker value-format="yyyy-MM-dd" v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        </el-col>
      </el-row>-->
      <div class="_input">
        <el-input @change="change" v-model="name" placeholder="请输入教师姓名 / 工号搜索">
          <el-button @click.native="change" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>

      <div>
        <el-date-picker
          @change="change"
          value-format="yyyy-MM-dd"
          v-model="date"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </div>

      <div>
        <span>年级</span>
        <el-select @change="gradeChange" v-model="grade">
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
        <span>是否准时</span>
        <el-select @change="change" v-model="onTime">
          <el-option label="全部" value></el-option>
          <el-option :label="'是'" :value="true"></el-option>
          <el-option :label="'否'" :value="false"></el-option>
        </el-select>
      </div>
    </header>
    <div class="_table">
      <el-table :data="teacherArrive" border style="width: 100%">
        <el-table-column align="center" prop="showName" label="任课教师（工号）"></el-table-column>
        <el-table-column align="center" prop="today" label="日期"></el-table-column>
        <el-table-column align="center" prop="courseTime" label="课程时间"></el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称"></el-table-column>
        <el-table-column align="center" label="年级">
          <template slot-scope="scope">
            <span>{{scope.row.gradeClass | getGrade}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="班号">
          <template slot-scope="scope">
            <span>{{scope.row.gradeClass | getClass}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="hasExact" label="是否准时">
          <template slot-scope="scope">
            <span>{{scope.row.hasExact?'准时':'不准时'}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="firstLoginTime" label="最早进入教室时间"></el-table-column>

        <el-table-column align="center" prop="existTime" label="结束课程时间"></el-table-column>
      </el-table>

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
      </footer>
    </div>
  </div>
</template>

<script>
import { today } from "@/utils";
import { mapActions, mapState, mapMutations } from "vuex";
import { cntTeacher } from "@/api/account/student";
export default {
  data() {
    return {
      teacherArrive: [],
      name: "",
      grade: "",
      classNum: "",
      onTime: "",
      date: today(new Date()).split(" ")[0],
      currentPage: 1,
      total: 0
    };
  },
  computed: {
    ...mapState("student", ["gradeList", "classList"])
  },
  filters: {
    getGrade(val) {
      let arr = [];
      for (let item of val.split(",")) {
        arr.push(item.split("-")[0]);
      }

      return arr.toString() === "All" ? "全年级" : arr.toString();
    },
    getClass(val) {
      let arr = [];
      for (let item of val.split(",")) {
        arr.push(item.split("-")[1]);
      }

      return arr.toString() === "All" ? "全班级" : arr.toString();
    }
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("student", ["queryGrade", "queryClass"]),
    initData() {
      this.queryGrade();
      this.queryClass({
        gradeId: ""
      });
      this.query(1);
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
      this.query(1);
    },
    change() {
      this.currentPage = 1;
      this.query(1);
    },
    query(page) {
      cntTeacher({
        classNo: this.classNum,
        condition: this.name,
        date: this.date,
        grade: this.grade,
        hasExact: this.onTime,
        pageNum: page,
        pageSize: 10
      }).then(res => {
        if (res.code == 200) {
          this.teacherArrive = res.rows;
          this.total = res.total;
        }
      });
    },
    pageSkip(page) {
      this.currentPage = page;
      this.query(page);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
#teacherArrive {
  @include container;
  header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    ._input {
      width: 400px;
    }
    & > div {
      margin-right: 20px;
      margin-top: 10px;
    }
  }
  ._table {
    margin-top: 20px;
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
}
</style>
