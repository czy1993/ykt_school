<template>
  <div class="app-container match-detaild">
    <div class="match-header bor-shadow">用量配置记录</div>
    <div class="match-view bor-shadow">
      <div class="table-from">
        <span>额定用量变更记录</span>
        <el-select v-model="schoolId_1" clearable size="mini" @change="get_queryUseUpdateDetail('1')" placeholder="请选择学校">
          <el-option v-for="item in school" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
      <el-table
        class="table-view"
        :data="tableData_1"
        border
        style="width: 100%"
        id="rebateSetTable"
      >
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="schoolName" label="学校"></el-table-column>
        <el-table-column prop="oldRoomNum" label="原额定教室(间)"></el-table-column>
        <el-table-column prop="classRoomNum" label="现额定教室(间)"></el-table-column>
        <el-table-column prop="oldTimeNum" label="原额定时长(分钟)"></el-table-column>
        <el-table-column prop="classTimeNum" label="现额定时长(分钟)"></el-table-column>
        <el-table-column prop="createBy" label="操作人"></el-table-column>
      </el-table>
       <el-pagination
        @current-change="handleCurrentChange_1"
        :current-page="pageNum_1"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total_1"
      ></el-pagination>
    </div>
    <div class="match-view bor-shadow">
      <div class="table-from">
        <span>临时用量添加记录</span>
        <el-select v-model="schoolId_2" clearable size="mini" @change="get_queryUseUpdateDetail('2')" placeholder="请选择学校">
          <el-option v-for="item in school" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-table
        class="table-view"
        :data="tableData_2"
        border
        style="width: 100%"
        id="rebateSetTable"
      >
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="schoolName" label="学校"></el-table-column>
        <el-table-column prop="classRoomNum" label="添加临时教室(间)"></el-table-column>
        <el-table-column prop="classTimeNum" label="添加临时时长(分钟)"></el-table-column>
        <el-table-column prop="expirationTime" label="有效期"></el-table-column>
        <el-table-column prop="createBy" label="操作人"></el-table-column>
      </el-table>
       <el-pagination
        @current-change="handleCurrentChange_2"
        :current-page="pageNum_2"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total_2"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { queryUseUpdateDetail } from "@/api/backstage.js";
import { selectAllSchool } from "@/api/system/role.js";
export default {
  data() {
    return {
      schoolId_1: "",
      schoolId_2: "",
      school: [],
      tableData_1: [],
      tableData_2: [],
      total_1:0,
      total_2:0,
      pageNum_1:1,
      pageNum_2: 1,
      pageSize: 10,
      schoolName: "",
    };
  },
  created() {
    this.get_queryUseUpdateDetail("1");
    this.get_queryUseUpdateDetail("2");
    this.get_selectAllSchool();
  },
  methods: {
    get_selectAllSchool() {
      selectAllSchool().then((res) => {
        if (res.code == 200) {
          this.school = res.data;
        }
      });
    },
    get_queryUseUpdateDetail(type) {
      let data = `pageNum=${this[`pageNum_${type}`]}&pageSize=10&type=${type}&schoolName=${this[`schoolId_${type}`]}`;
      queryUseUpdateDetail(data).then((res) => {
        if (res.code == 200) {
          this[`tableData_${type}`] = res.rows;
          this[`total_${type}`] = res.total;
        }
      });
    },
    handleCurrentChange_1(val) {
      this.pageNum_1 = val;
      this.get_queryUseUpdateDetail('1');
    },
    handleCurrentChange_2(val) {
      this.pageNum_2 = val;
      this.get_queryUseUpdateDetail('2');
    },
  },
};
</script>
<style lang="scss" scoped>
.match-detaild {
  .match-header {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
  .match-view {
    margin-bottom: 20px;
    padding: 8px 0;
    .table-from {
      font-size: 14px;
      margin-bottom: 8px;
      padding-left: 10px;
      span {
        margin-right: 10px;
      }
    }
    .table-view{
        margin-bottom: 8px;
    }
  }
}
</style>