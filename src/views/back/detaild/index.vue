<template>
  <div class="app-container room-detaild">
    <div class="room-head">用量管理</div>
    <div class="room-contart">
      <div class="from-view">
        <div class="from-dd">
          <el-date-picker
            v-model="date"
            type="date"
            value-format="yyyy-MM-dd"
            @change="get_queryUseDetail"
            placeholder="选择日期"
          ></el-date-picker>
          <span class="from-name">学校:</span>
          <el-select v-model="schoolId" clearable  @change="get_queryUseDetail" placeholder="请选择学校">
            <el-option v-for="item in school" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <span class="from-name">课程状态:</span>
          <el-select v-model="courseType" clearable  @change="get_queryUseDetail" placeholder="状态">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="from-dd">
          <span>导出</span>
          <img @click="save_exportExcel('rebateSetTable','用量管理')" src="../../../assets/image/ico_dc.png" alt />
        </div>
      </div>
      <el-table class="table-view" :data="tableData" border style="width: 100%" id="rebateSetTable">
        <el-table-column prop="date" label="日期" width="100"></el-table-column>
        <el-table-column prop="schoolName" label="学校"></el-table-column>
        <el-table-column prop="contactsM" label="课程编号" width="90"></el-table-column>
        <el-table-column prop="arrangeId" label="录像编号" width="90"></el-table-column>
        <el-table-column prop="courseType" label="课程状态" width="80">
            <template slot-scope="scope">
                <span :class="scope.row.courseType=='3'?'zf':'act'">{{typeList[Number(scope.row.courseType)].name}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="startTime" label="上课时间"></el-table-column>
        <el-table-column prop="endTime" label="下课时间"></el-table-column>
        <el-table-column prop="courseTime" label="上课时长" width="100"></el-table-column>
        <el-table-column prop="contactsM" label="巡检时间"></el-table-column>
        <el-table-column prop="comeCourseNum" label="听课人数(人)" width="100"></el-table-column>
        <el-table-column prop="teacherNum" label="授课人数(人)" width="100"></el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import { useTotal, queryUseDetail, schoolMenu } from "@/api/backstage.js";
import { selectAllSchool } from "@/api/system/role.js";
import {  exportExcel } from "@/utils/exportExcel.js";
export default {
  data() {
    return {
      school: [],
      tableData: [],
      typeList: [
        {
          value: 1,
          name: "已上完",
        },
        {
          value: 2,
          name: "上课中",
        },
        {
          value: 3,
          name: "未上课",
        },
        {
          value: 4,
          name: "已作废",
        },
      ],
      pageNum: 1,
      pageSize: 10,
      courseType: "",
      date: "",
      schoolId: "",
      total: 0,
    };
  },
  created() {
    this.get_queryUseDetail();
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
    get_queryUseDetail() {
      let data = `pageNum=${this.pageNum}&pageSize=${this.pageSize}&courseType=${this.courseType}&date=${this.date}&schoolId=${this.schoolId}`;
      queryUseDetail(data).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.get_queryUseDetail();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.get_queryUseDetail();
    },
    save_exportExcel(id,name){
      exportExcel(id,name)
    },
  },
};
</script>
<style lang="scss" scoped>
.room-detaild {
  .room-head {
    height: 50px;
    font-size: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    padding-left: 10px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .room-contart {
    .from-view {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .from-dd {
        display: flex;
        align-items: center;
        img{
          margin: 0 6px;
          height: 20px;
        }
      }
      .from-name {
        margin-left: 15px;
        margin-right: 8px;
      }
    }
    .table-view {
      text-align: center;
      margin-bottom: 10px;
    }
  }
  .zf{
      color: #B9B9B9;
  }
  .act{
      color: #5EB8EB;
  }

}
</style>


