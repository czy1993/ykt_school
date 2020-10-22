<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      title="Dialog Titile"
    >
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="12">
            <el-form-item label="教师" prop="userName">
              <el-select
                v-model="formData.userName"
                placeholder="请选择教师"
                clearable
                :style="{width: '100%'}"
              >
                <el-option
                  v-for="(item, index) in userNameOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入课程名称"
                clearable
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                placeholder="请输入六位数密码"
                clearable
                show-password
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label prop="imgUrl">
              <el-upload
                ref="imgUrl"
                :file-list="imgUrlfileList"
                :action="imgUrlAction"
                :before-upload="imgUrlBeforeUpload"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="时间" prop="day">
              <el-date-picker
                v-model="formData.day"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{width: '100%'}"
                placeholder="请选择时间"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="-1px" label prop="time">
              <el-time-picker
                v-model="formData.time"
                is-range
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                :style="{width: '100%'}"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="至"
                clearable
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设置重复" prop="isRepeat" required>
              <el-switch v-model="formData.isRepeat"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="116px" label="添加课程对象" prop="field115" required>
              <el-switch v-model="formData.field115"></el-switch>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      formData: {
        userName: undefined,
        name: undefined,
        password: undefined,
        imgUrl: null,
        day: null,
        time: null,
        isRepeat: true,
        field115: true,
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请选择教师",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入课程名称",
            trigger: "blur",
          },
        ],
        password: [],
        day: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        time: [
          {
            required: true,
            message: "不能为空",
            trigger: "change",
          },
        ],
      },
      imgUrlAction: "https://jsonplaceholder.typicode.com/posts/",
      imgUrlfileList: [],
      userNameOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],

      // 参数
      obj: {
        applyReason: "",  //申请理由
        auditStatus: "",  //审核状态 1-待批准 2-未通过 3-已通过 4-被调课	
        endTime: "",      // 结束时间
        id: 0,  
        imgUrl: "",
        isRepeat: "",
        name: "",
        objList: [
          {
            className: "",
            gradeName: "",
            teacherName: "",
            type: "",
            userName: "",
          },
        ],
        password: "",
        repeatEnd: "",
        repeatTime: "",
        repeatType: "",
        schoolId: 0,
        startTime: "",
        stuGrade: "",
        stuType: "",
        teacherType: "",
        type: "",
        userName: "",
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        this.close();
      });
    },
    imgUrlBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      return isRightSize;
    },
  },
};
</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}
</style>


