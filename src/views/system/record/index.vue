<template>
  <div class="app-container record">
    <div class="record-header">课程记录表</div>
    <div class="record-from">
      <el-input placeholder="请输入教师名称/工号搜索" v-model="input3" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-form ref="elForm" :model="formData"  size="medium" label-width="100px">
        <el-col :span="4">
          <el-form-item label-width="40px" label="年级" prop="field102">
            <el-select
              v-model="formData.field102"
              placeholder="年级"
              clearable
              @change="get_queryClass(formData.field102)"
              :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in field102Options"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="40px" label="班级" prop="field103">
            <el-select
              v-model="formData.field103"
              placeholder="班级"
              clearable
              :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in field103Options"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="70px" label="课程类型" prop="field104">
            <el-select
              v-model="formData.field104"
              placeholder="课程类型"
              clearable
              :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in field104Options"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="get_courseRecord">查询</el-button>
      </el-form>
    </div>
    <el-table class="el_table" border :data="tableData" style="width: 100%">
      <el-table-column prop="createTime" label="时间" width="180"></el-table-column>
      <el-table-column prop="teacherName" label="调课教师" width="180"></el-table-column>
      <el-table-column prop="name" label="调课课程" width="180"></el-table-column>
      <el-table-column prop="gradeName" label="调课年级" width></el-table-column>
      <el-table-column prop="className" label="调课班级" width="180"></el-table-column>
      <el-table-column prop="type" label="调课类型" width="180">
        <template  slot-scope="scope">
          <span v-if="scope.row.type=='1'">上架</span>
          <span v-else>下架</span>
        </template>
      </el-table-column>
      <el-table-column prop="repeatText" label="调课信息">
        <template  slot-scope="scope">
          <span>{{weekArr[new Date(scope.row.startTime.substring(0,10)).getDay()]}}</span>
          <span>{{scope.row.startTime.substring(10,16)}}</span>-
          <span>{{scope.row.endTime.substring(10,16)}}</span>
          <span>{{scope.row.repeatText}}</span>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
     class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { courseRecord } from "@/api/teacher.js";
import { queryGrade, queryClass } from "@/api/index.js";
import { today, deepCopy } from "@/utils/index.js";
export default {
  components: {},
  props: [],
  data() {
    return {
      input3: "",
      currentPage1: 1,
      formData: {
        field102: "",
        field103: "",
        field104: "",
      },
      rules: {
        field102: [],
        field103: [],
        field104: [],
      },
      field102Options: [],
      field103Options: [],
      field104Options: [
        {
          label: "课程上架",
          value: 1,
        },
        {
          label: "课程下架",
          value: 2,
        },
      ],
      tableData: [],
      total: 0,
      pageNum:1,
      pageSize:10,
      weekArr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.get_queryGrade();
    this.get_courseRecord();
  },
  mounted() {},
  methods: {
    submitForm() {
      
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    get_queryGrade() {
      queryGrade().then((res) => {
        if (res.code == 200) {
          this.field102Options = res.data;
        }
      });
    },
    get_queryClass(id) {
      queryClass(`${id}`).then((res) => {
        if (res.code == 200) {
          this.field103Options = res.data;
        }
      });
    },
    get_courseRecord() {
      let data = `className=${this.formData.field103}&gradeName=${this.grade_Name(this.formData.field102)}
      &multiName=${this.input3}&type=${this.formData.field104}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`
      courseRecord(data).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    // 查询年级名称
    grade_Name(id){
      let grade = deepCopy(this.field102Options);
      let name = "";
      grade.forEach(element => {
        if(element.id == id){
          name = element.name
        }
      });
      return name
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.get_courseRecord()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.get_courseRecord()
    },
  },
};
</script>
<style lang="scss" scoped>
.record {
  .record-header {
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
  .input-with-select {
    width: 300px;
  }
  .record-from {
    display: flex;
    flex-wrap: wrap;
    .el-col {
      margin-left: 15px;
      margin-right: 15px;
    }
    .el-button {
      //   margin-left: 15px;
    }
  }
  .el_table{
    margin-bottom: 15px;
    text-align: center;
  }
}
</style>
