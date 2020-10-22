<template>
  <div id="addStudent">
    <el-form
      :model="studentMessage"
      :rules="rules"
      ref="studentMessage"
      label-width="110px"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入管理员类别，建议使用罗马数字" v-model="studentMessage.name"></el-input>
      </el-form-item>
      <el-form-item required label="性别" prop="sexDict">
        <el-radio-group v-model="studentMessage.sexDict">
          <el-radio :label="'0'">男</el-radio>
          <el-radio :label="'1'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学号" prop="stuNo">
        <el-input placeholder="请输入学号" v-model.number="studentMessage.stuNo"></el-input>
      </el-form-item>

      <el-form-item label="身份证号" prop="idcard">
        <el-input placeholder="请输入身份证号" v-model="studentMessage.idcard"></el-input>
      </el-form-item>

      <el-form-item label="年级" prop="grade">
        <el-select
          @change="gradeChange"
          popper-class="grade_select"
          v-model="studentMessage.grade"
          placeholder="请选择年级"
        >
          <el-option v-for="item of gradeList" :label="item.name" :value="item.name" :key="item.id"></el-option>
          <el-option label="新增年级" value="add"></el-option>
        </el-select>
        <div v-show="studentMessage.grade==='add'" class="add_input">
          <el-input placeholder="请输入年级" v-model="studentMessage.addGrade"></el-input>
          <span style="font-size:12px;color:#a6a6a6">建议使用入学年份命名，示例：2020级</span>
        </div>
      </el-form-item>

      <el-form-item label="班号" prop="classNo">
        <el-select popper-class="grade_select" v-model="studentMessage.classNo" placeholder="请选择班号">
          <el-option v-for="item of classList" :label="item.name" :value="item.name" :key="item.id"></el-option>
          <el-option label="新增班号" value="add"></el-option>
        </el-select>
        <div v-show="studentMessage.classNo==='add'" class="add_input">
          <el-input placeholder="请输入班号" v-model="studentMessage.addClass"></el-input>
          <!-- <span style="font-size:12px;color:#a6a6a6">建议使用入学年份命名，示例：2020级</span> -->
        </div>
      </el-form-item>

      <el-form-item label="家长联系方式" prop="phone">
        <el-input placeholder="请输入联系方式" v-model.number="studentMessage.phone"></el-input>
      </el-form-item>

      <el-form-item label="初始密码" prop="password">
        <el-input
          show-password
          placeholder="请输入初始密码"
          type="password"
          v-model="studentMessage.password"
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
import { addOne } from "@/api/account/student";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  props: ["visible"],
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback("请输入正确格式的手机号");
      } else {
        callback();
      }
    };

    const validateIDcard = (rule, value, callback) => {
      if (
        !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
          value
        )
      ) {
        callback("请输入正确格式的身份证号码");
      } else {
        callback();
      }
    };

    return {
      studentMessage: {
        name: "",
        sexDict: "0",
        stuNo: "",
        idcard: "",
        grade: "",
        addGrade: "",
        classNo: "",
        addClass: "",
        phone: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" }
        ],
        stuNo: [{ required: true, message: "请输入学号", trigger: "blur" }],
        idcard: [{ validator: validateIDcard, trigger: "blur" }],
        grade: [{ required: true, message: "请选择年级", trigger: "change" }],
        addGrade: [{ required: true, message: "请输入年级", trigger: "blur" }],
        classNo: [{ required: true, message: "请选择班号", trigger: "change" }],
        phone: [
          { required: true, message: "请输入家长联系方式", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
        // password: [
        //   { required: true, message: "请输入初始密码", trigger: "blur" }
        // ]
      }
    };
  },
  computed: {
    ...mapState("student", ["gradeList", "classList"])
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("student", ["queryGrade", "queryClass"]),
    ...mapMutations("student", ["SAVE_CLASSS"]),
    initData() {
      this.queryGrade();
    },
    confirm() {
      this.$refs["studentMessage"].validate(valid => {
        if (valid) {
          if (this.studentMessage.grade === "add") {
            this.studentMessage.grade = this.studentMessage.addGrade;
          }
          if (this.studentMessage.classNo === "add") {
            this.studentMessage.classNo = this.studentMessage.addClass;
          }
          addOne(this.studentMessage).then(res => {
            if (res.code == 200) {
              this.$message.success("新增学生成功！");
              this.$emit("success");
            }
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      // this.$emit("cancel");
      this.$message.success("已取消所有操作");
      this.$refs["studentMessage"].resetFields();
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
        this.SAVE_CLASSS([]);
      }
    }
  },
  watch: {
    visible() {
      this.initData();
      this.$refs["studentMessage"].resetFields();
    }
  }
};
</script>
<style lang="scss">
#addStudent {
  .el-select {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
#addStudent {
  padding: 0 20px;
  .grade_select {
    width: 100%;
  }
  .add_input {
    margin-top: 10px;
  }
}
</style>
