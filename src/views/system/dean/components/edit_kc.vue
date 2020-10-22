<template>
  <div>
    <el-row :gutter="0">
      <el-form ref="elForm" :model="formData" :rules="rules" size="small" label-width="98px">
        <el-col :span="15">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入课程名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="教师" prop="teacher">
            <el-select v-model="formData.teacher" placeholder="请输入教师名称或工号" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in teacherOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" maxlength="6" placeholder="请输入六位数密码，不填则不设置密码" clearable show-password
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="日期" prop="days">
            <el-date-picker v-model="formData.days" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label-width="52px" label="时间" prop="field105">
            <el-time-picker v-model="formData.field105" is-range format="HH:mm:ss" value-format="HH:mm:ss"
              :style="{width: '100%'}" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至"
              clearable></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label="设置重复" prop="field106" required>
            <el-switch v-model="formData.field106"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label="重复类型" prop="field108">
            <el-radio-group v-model="formData.field108" size="medium">
              <el-radio v-for="(item, index) in field108Options" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束重复" prop="field109">
            <el-radio-group v-model="formData.field109" size="medium">
              <el-radio v-for="(item, index) in field109Options" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label-width="1px" label="" prop="field110">
            <el-date-picker v-model="formData.field110" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="1px" label="" prop="field111">
            <el-input-number v-model="formData.field111" placeholder="请输入"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label-width="119px" label="添加课程对象" prop="field113" required>
            <el-switch v-model="formData.field113"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择学生" prop="field114">
            <el-radio-group v-model="formData.field114" size="medium">
              <el-radio v-for="(item, index) in field114Options" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="120px" label="部分年级学生" prop="field115">
            <el-checkbox-group v-model="formData.field115" size="medium">
              <el-checkbox v-for="(item, index) in field115Options" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label-width="120px" label="部分班级学生" prop="field116">
            <el-cascader v-model="formData.field116" :options="field116Options" :props="field116Props"
              :style="{width: '100%'}" placeholder="请选择部分班级学生" separator="-" clearable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择教师" prop="field123">
            <el-radio-group v-model="formData.field123" size="medium">
              <el-radio v-for="(item, index) in field123Options" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="120px" label="部分年级教师" prop="field124">
            <el-checkbox-group v-model="formData.field124" size="medium">
              <el-checkbox v-for="(item, index) in field124Options" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label-width="120px" label="部分班级教师" prop="field125">
            <el-cascader v-model="formData.field125" :options="field125Options" :props="field125Props"
              :style="{width: '100%'}" placeholder="请选择部分班级教师" separator="-" clearable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        name: undefined,
        teacher: undefined,
        password: undefined,
        days: null,
        field105: ["15:42:05", "23:43:05"],
        field106: false,
        field108: 2,
        field109: undefined,
        field110: null,
        field111: 0,
        field113: false,
        field114: 1,
        field115: [],
        field116: [1, 2],
        field123: 1,
        field124: [],
        field125: [1, 2],
      },
      rules: {
        name: [{
          required: true,
          message: '请输入课程名称',
          trigger: 'blur'
        }],
        teacher: [{
          required: true,
          message: '请输入教师名称或工号',
          trigger: 'change'
        }],
        password: [],
        days: [{
          required: true,
          message: '请选择日期',
          trigger: 'change'
        }],
        field105: [{
          required: true,
          type: 'array',
          message: '请至少选择一个field105',
          trigger: 'change'
        }],
        field108: [{
          required: true,
          message: '重复类型不能为空',
          trigger: 'change'
        }],
        field109: [{
          required: true,
          message: '结束重复不能为空',
          trigger: 'change'
        }],
        field110: [],
        field111: [],
        field114: [{
          required: true,
          message: '选择学生不能为空',
          trigger: 'change'
        }],
        field115: [],
        field116: [],
        field123: [{
          required: true,
          message: '选择教师不能为空',
          trigger: 'change'
        }],
        field124: [],
        field125: [],
      },
      teacherOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      field108Options: [{
        "label": "每天重复",
        "value": 1
      }, {
        "label": "每周重复",
        "value": 2
      }, {
        "label": "每两周重复",
        "value": 3
      }, {
        "label": "每月重复",
        "value": ""
      }],
      field109Options: [{
        "label": "不重复",
        "value": 1
      }, {
        "label": "重复10次后结束",
        "value": 2
      }, {
        "label": "重复  结束于",
        "value": 3
      }],
      field114Options: [{
        "label": "全体学生",
        "value": 1
      }, {
        "label": "部分年级学生",
        "value": 2
      }, {
        "label": "部分班级学生",
        "value": ""
      }],
      field115Options: [{
        "label": "七年级",
        "value": 1
      }, {
        "label": "八年级",
        "value": 2
      }, {
        "label": "九年级",
        "value": 3
      }],
      field116Options: [],
      field123Options: [{
        "label": "全体教师",
        "value": 1
      }, {
        "label": "部分年级教师",
        "value": 2
      }, {
        "label": "部分班级教师",
        "value": ""
      }],
      field124Options: [{
        "label": "七年级",
        "value": 1
      }, {
        "label": "八年级",
        "value": 2
      }, {
        "label": "九年级",
        "value": 3
      }],
      field125Options: [],
      field116Props: {
        "multiple": false
      },
      field125Props: {
        "multiple": false
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    getField116Options() {
      // TODO 发起请求获取数据
      this.field116Options
    },
    getField125Options() {
      // TODO 发起请求获取数据
      this.field125Options
    },
  }
}

</script>
<style>
</style>
