<template>
  <div id="addLeaveRecord">
    <el-form
      :model="leaveRecordMessage"
      :rules="rules"
      ref="leaveRecordMessage"
      label-width="110px"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-form-item label="选择日期" prop="leaveDate">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="leaveRecordMessage.leaveDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="15">
          <el-form-item label="选择班级" prop="grade">
            <el-select placeholder="请选择年级" @change="gradeChange" v-model="leaveRecordMessage.grade">
              <el-option
                v-for="(item,index) of gradeClassNo"
                :key="index"
                :value="item.name"
              >{{item.name}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label-width="10px" prop="classNo">
            <el-select
              @change="classChange"
              placeholder="请选择班号"
              v-model="leaveRecordMessage.classNo"
            >
              <el-option v-for="(item,index) of classList" :key="`class_${index}`" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="选择学生" prop="stuNo">
        <el-select v-model="leaveRecordMessage.stuNo" placeholder="请选择学生">
          <el-option
            v-for="item in studentList"
            :key="item.id"
            :label="item.name"
            :value="item.stuNo"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item  label="选择时间" prop="timeArr">
        <el-time-picker
          is-range
          v-model="leaveRecordMessage.timeArr"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          value-format="HH:mm:ss"
        ></el-time-picker>
      </el-form-item>

      <el-form-item label="请假原因" prop="remark">
        <el-input
          :maxlength="20"
          show-word-limit
          v-model="leaveRecordMessage.remark"
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click.native="cancel" type="info" plain>取消</el-button>
        <el-button @click.native="confirm" type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { today } from "@/utils";
import { addLeaveRecord } from "@/api/account/student";
export default {
  data() {
    return {
      classList: [],

      leaveRecordMessage: {
        leaveDate: today(new Date()).split(" ")[0],
        timeArr: ["", today(new Date()).split(" ")[1]],
        grade: "",
        classNo: "",
        stuNo: "",
        remark: ""
      },
      rules: {
        leaveDate: [{ required: true, message: "请选择日期", trigger: "blur" }],
        grade: [{ required: true, message: "请选择年级", trigger: "blur" }],
        classNo: [{ required: true, message: "请选择班号", trigger: "blur" }],
        stuNo: [{ required: true, message: "请选择学生", trigger: "blur" }],
        timeArr: [{ required: true, message: "请选择时间", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("student", ["studentList", "gradeClassNo"]),
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("student", [
      "queryStudentByCondition",
      "getGradeCascadeClassNo",
      "queryCourseByStudent"
    ]),
    initData() {
      this.getGradeCascadeClassNo({ pageType: "1" });
    },
    gradeChange(val) {
      this.leaveRecordMessage.classNo = "";
      this.leaveRecordMessage.listenMember = "";
      for (let grade of this.gradeClassNo) {
        if (grade.name === val) {
          return void (this.classList = grade.classList);
        }
      }
    },
    classChange(val) {
      this.leaveRecordMessage.listenMember = "";
      this.queryStudentByCondition({
        grade: this.leaveRecordMessage.grade,
        classNo: this.leaveRecordMessage.classNo,
         pageType: "1"
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$refs["leaveRecordMessage"].validate(valid => {
        if (valid) {
          addLeaveRecord({
            leaveTimeEnd:
              this.leaveRecordMessage.leaveDate +
              " " +
              this.leaveRecordMessage.timeArr[1],
            leaveTimeStart:
              this.leaveRecordMessage.leaveDate +
              " " +
              this.leaveRecordMessage.timeArr[0],
            remark: this.leaveRecordMessage.remark,
            schoolId: this.userInfo.schoolId,
            stuNo: this.leaveRecordMessage.stuNo
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.$emit("success");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
};
</script>
<style lang="scss">
#addLeaveRecord {
  .el-date-editor {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
#addLeaveRecord {
  padding: 0 20px;
}
</style>
