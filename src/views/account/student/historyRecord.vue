<template>
  <div id="historyRecord">
    <header>
      <div>
        <el-input @change="search" placeholder="请输入姓名/学号搜索" v-model="name">
          <el-button @click.native="search" slot="append" icon="el-icon-search"></el-button>
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
        <span>操作类型</span>
        <el-select @change="change" v-model="operationType">
          <el-option label="全部" value></el-option>
          <el-option :label="'密码重置'" :value="'1'"></el-option>
          <el-option :label="'账号删除'" :value="'2'"></el-option>
          <el-option :label="'新增账户'" :value="'3'"></el-option>
          <el-option :label="'班级修改'" :value="'4'"></el-option>
        </el-select>
      </div>
    </header>
    <div class="table">
      <el-table :data="historyList" border style="width: 100%">
        <el-table-column align="center" prop="updateTime" label="操作时间"></el-table-column>
        <el-table-column align="center" prop="name" label="姓名（学号）"></el-table-column>
        <el-table-column align="center" prop="stuNo" label="学号"></el-table-column>
        <el-table-column align="center" prop="grade" label="全部年级"></el-table-column>
        <el-table-column align="center" prop="classNo" label="全部班号"></el-table-column>
        <el-table-column align="center" prop="type" label="操作类型">
          <template slot-scope="scope">
            <span>{{operType[scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="content" label="详情">
          <template slot-scope="scope">
            <span>{{scope.row.content||'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateBy" label="操作人"></el-table-column>
      </el-table>
      <footer>
        <span>共{{total}}项</span>
        <el-pagination
          @size-change="sizeChange"
          @current-change="pageSkip"
          :page-sizes="[10,20,50]"
          :page-size="size"
          background
          layout="sizes,prev, pager, next"
          :pager-count="5"
          :total="total"
        ></el-pagination>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      name: "",
      total: 1,
      classNum: "",
      grade: "",
      operationType: "",
      currentPage: 1,
      operType: {
        "1": "密码重置",
        "2": "账号删除",
        "3": "新增账户",
        "4": "班级修改"
      },
      size: 10
    };
  },
  computed: {
    ...mapState("student", ["historyList", "gradeList", "classList"])
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("student", ["queryGrade", "queryClass", "updateHistory"]),
    ...mapMutations("student", ["SAVE_CLASSS"]),
    initData() {
      this.queryGrade();
      this.queryClass({
        gradeId: ""
      });
      this.query(1);
    },
    query(page, ...rest) {
      this.updateHistory({
        pageNum: page,
        pageSize:this.size,
        classNo: this.classNum,
        grade: this.grade,
        type: this.operationType,
        condition: this.name
      }).then(res => {
        this.total = res.total;
      });
    },
    change() {
      this.query(this.currentPage);
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
    pageSkip(page) {
      this.currentPage = page;
      this.query(page);
    },
    search() {
      this.currentPage = 1;
      this.query(1);
    },
    sizeChange(size) {
      this.currentPage = 1;
      this.size = size;
      this.query(1);
    }
  },
  watch: {
    grade(val) {
      this.gradeChange(val);
    }
  }
};
</script>

<style lang="scss" scoped>
#historyRecord {
  padding: 30px 37px;
  font-size: 14px;
  header {
    display: flex;
    flex-wrap: wrap;
    & > div {
      margin-right: 20px;
      flex: 1.3;
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
  }
  .table {
    margin-top: 20px;
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .tip {
        color: #61acf1;
        cursor: pointer;
      }
    }
  }
}
</style>
