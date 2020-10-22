<template>
  <div id="addAbnormal">
    <el-form
      :model="abnormalMessage"
      :rules="rules"
      ref="abnormalMessage"
      label-width="110px"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-form-item label="选择日期" prop="date">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="abnormalMessage.date"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="15">
          <el-form-item label="选择班级" prop="grade">
            <el-select placeholder="请选择年级" @change="gradeChange" v-model="abnormalMessage.grade">
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
            <el-select @change="classChange" placeholder="请选择班号" v-model="abnormalMessage.classNo">
              <el-option v-for="(item,index) of classList" :key="`class_${index}`" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="选择学生" prop="listenMember">
        <el-select v-model="abnormalMessage.listenMember" placeholder="请选择学生">
          <el-option
            v-for="item in studentList"
            :key="item.id"
            :label="item.name"
            :value="item.stuNo"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择课程" prop="courseArrangeId">
        <el-select
          @change="courseChange"
          v-model="abnormalMessage.courseArrangeId"
          placeholder="请选择课程"
        >
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.courseName"
            :value="item.courseArrangeId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="异常详情" prop="errorDetail">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="多个异常用分号；隔开"
          v-model="abnormalMessage.errorDetail"
          :maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="告知家长方式" prop="noticeParentWay">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="abnormalMessage.noticeParentWay"
          :maxlength="15"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="家长回应" prop="parentFeedback">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="abnormalMessage.parentFeedback"
          :maxlength="30"
          show-word-limit
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
import { addErrorRecord } from "@/api/account/student";
export default {
  data() {
    return {
      loading: false,
      classList: [],
      abnormalMessage: {
        date: today(new Date()).split(" ")[0],
        grade: "",
        classNo: "",
        listenMember: "",
        courseArrangeId: "",
        courseId: "",
        errorDetail: "",
        noticeParentWay: "",
        parentFeedback: "",
      },
      rules: {
        date: [{ required: true, message: "请选择时间日期", trigger: "blur" }],
        grade: [{ required: true, message: "请选择年级", trigger: "blur" }],
        classNo: [{ required: true, message: "请选择班号", trigger: "blur" }],
        listenMember: [
          { required: true, message: "请选择学生", trigger: "blur" }
        ],
        courseArrangeId: [
          { required: true, message: "请选择课程", trigger: "blur" }
        ],
        errorDetail: [
          { required: true, message: "请输入异常详情", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState("student", ["studentList", "gradeClassNo", "courseList"]),
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
      this.abnormalMessage.classNo = "";
      this.abnormalMessage.courseArrangeId = "";
      for (let grade of this.gradeClassNo) {
        if (grade.name === val) {
          return void (this.classList = grade.classList);
        }
      }
    },
    classChange(val) {
      this.abnormalMessage.courseArrangeId = "";
      this.queryStudentByCondition({
        grade: this.abnormalMessage.grade,
        classNo: this.abnormalMessage.classNo,
         pageType: "1"
      });
      this.queryCourseByStudent({
        grade: this.abnormalMessage.grade,
        classNo: this.abnormalMessage.classNo,
        date: this.abnormalMessage.date,
        isOpen: true,
        pageType:'1'
      });
    },
    courseChange(val) {
      this.abnormalMessage.courseId = this.courseList.find(course => {
        return course.courseArrangeId === val;
      }).courseId;
    },
    cancel() {},
    confirm() {
      this.$refs["abnormalMessage"].validate(valid => {
        if (valid) {
          addErrorRecord({...this.abnormalMessage,schoolId:this.userInfo.schoolId}).then(res => {
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
  }
};
</script>

<style lang="scss">
#addAbnormal {
  .el-date-editor {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>


<style lang="scss" scoped>
#addAbnormal {
  padding: 0 20px;
}
</style>
