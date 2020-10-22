<template>
  <div class="dean_left">
    <div class="dean-container-date">
      <h5>今日课程</h5>
      <div class="date-from">
        <el-select v-model="grade" @change="query_Class(grade_query(grade))" placeholder="年级">
          <el-option v-for="item in gradeArr" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <el-select
          class="classNum"
          v-model="classValue"
          @change="get_timetable(days)"
          placeholder="班级"
        >
          <el-option v-for="item in classArr" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <el-button type="primary" @click="showDialog">新增课程</el-button>
      </div>
      <div class="calendar-view">
        <div>
          <el-calendar v-model="days">
            <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
            <template slot="dateCell" slot-scope="{date, data}">
              <div :class="['calendar-d',data.isSelected ? 'is-selected' : '']">
                {{ data.day.split('-')[2] }} {{ data.isSelected ? '✔️' : ''}}
                <span
                  v-show="dealMyDate(data.day)"
                  class="day_active"
                ></span>
              </div>
            </template>
          </el-calendar>
        </div>
      </div>
    </div>
    <div class="dean-container-Timetable">
      <CourseList :name="'admin'" ref="CourseList" @event="event"></CourseList>
    </div>
    <!-- 新增课程 -->
    <el-dialog
      v-bind="$attrs"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      :title="dialog_title"
    >
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="20">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入课程名称"
                clearable
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="教师" prop="userName">
              <el-select
                v-model="formData.userName"
                placeholder="请选择教师"
                clearable
                :style="{width: '100%'}"
              >
                <el-option
                  v-for="(item) in userNameOptions"
                  :key="item.userName"
                  :label="`${item.nickName}(${item.userName})` "
                  :value="item.userName"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                placeholder="请输入六位数密码"
                clearable
                show-password
                maxlength="6"
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <div class="kc-img">
              <span>课程图片</span>
              <img
                class="imgs"
                :src="require(`@/assets/kc_img/${formData.imgUrl==''?'active':formData.imgUrl}.jpg`) "
                alt
              />
              <img
                class="imgs"
                @click="imgShow=true"
                src="../../../../assets/kc_img/bg_upmrt.png"
                alt
              />
            </div>
          </el-col>
          <el-col :span="10">
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

          <el-col :span="13">
            <el-time-select
              class="classNum"
              placeholder="起始时间"
              v-model="formData.start_Time"
              :picker-options="{
                  start: '06:00',
                  step: '00:5',
                  end: '21:30'
                }"
            ></el-time-select>
            <el-time-select
              class="classNum"
              placeholder="结束时间"
              v-model="formData.end_Time"
              :picker-options="{
                  start: '06:00',
                  step: '00:5',
                  end: '22:15',
                  minTime: formData.start_Time
                }"
            ></el-time-select>
          </el-col>
          <el-col :span="24" v-show="false">
            <el-form-item label="录制" prop="isRecord">
              <el-radio-group v-model="formData.isRecord" size="medium">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="提前入场" prop="entranceTime">
              <el-radio-group v-model="formData.entranceTime" size="medium">
                <el-radio label="0">0分钟</el-radio>
                <el-radio label="5">5分钟</el-radio>
                <el-radio label="10">10分钟</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设置重复" prop="isRepeat">
              <el-switch v-model="formData.isRepeat"></el-switch>
              <div v-show="isRepeatShow" class="isRepeat-view">
                <el-form-item label="重复类型" prop="repeatType">
                  <el-radio-group v-model="formData.repeatType" size="medium">
                    <el-radio
                      v-for="(item, index) in repeatTypeptions"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                    >{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="结束重复" prop="field101">
                  <el-radio-group v-model="formData.endRepetition" size="medium">
                    <el-radio label="1">
                      重复
                      <el-input
                        v-model="formData.repeatEnd"
                        :style="{width: '80px'}"
                        placeholder="次数"
                        :disabled="formData.endRepetition=='1'?false:true"
                      ></el-input>次结束
                    </el-radio>
                    <br />
                    <el-radio label="2">
                      重复 结束于
                      <el-date-picker
                        :disabled="formData.endRepetition=='2'?false:true"
                        value-format="yyyy-MM-dd"
                        v-model="formData.repeatTime"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-radio>
                    <br />
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="116px" label="添加课程对象" prop="kcObject" required>
              <el-switch v-model="formData.kcObject"></el-switch>
              <el-row v-show="iskcObjectShow" class="isRepeat-view">
                <el-form-item label="选择学生" prop="stuType">
                  <el-radio-group v-model="formData.stuType" size="medium">
                    <el-radio label="1">全体学生</el-radio>
                    <el-radio label="2">部分年级学生</el-radio>
                    <el-radio label="3">部分班级学生</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-checkbox-group
                  class="isRepeat-select"
                  v-if="isGradeshow"
                  v-model="formData.stuGrade"
                >
                  <el-checkbox
                    v-for="(item,index) in gradeArr"
                    :key="index"
                    :value="item.id"
                    :label="item.name"
                  ></el-checkbox>
                </el-checkbox-group>
                <el-row
                  class="isRepeat-select"
                  v-show="isClassshow"
                  v-for="(item,index) in grades"
                  :key="index"
                >
                  <el-select
                    v-model="grades[index].grade"
                    @change="gradeArrChange(index)"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="itemg in gradeArr"
                      :key="itemg.id"
                      :label="itemg.name"
                      :value="itemg.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    multiple
                    v-model="grades[index].classA"
                    @change="classArrChange(index)"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="itemc in item.classArr"
                      :key="itemc.name"
                      :label="itemc.name"
                      :value="itemc.name"
                    ></el-option>
                  </el-select>
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    @click="addGrades(index)"
                    circle
                  ></el-button>
                  <el-button
                    v-show="index!=0"
                    type="primary"
                    size="mini"
                    icon="el-icon-minus"
                    @click="reduceGrades(index)"
                    circle
                  ></el-button>
                </el-row>
                <el-row>
                  <el-form-item label="选择教师" prop="teacherType">
                    <el-radio-group v-model="formData.teacherType" size="medium">
                      <el-radio label="1">全体教师</el-radio>
                      <el-radio label="3">部分教师</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-select
                    v-show="isteachershow"
                    v-model="teacherType"
                    class="isRepeat-select teacherType-select"
                    multiple
                    clearable
                    placeholder="请教师"
                  >
                    <el-option
                      v-for="item in userNameOptions"
                      :key="item.userName"
                      :label="`${item.nickName}(${item.userName})`"
                      :value="item.nickName"
                    ></el-option>
                  </el-select>
                </el-row>
              </el-row>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
        <el-popover v-show="dialog_title!='新增课程'" placement="top-end" width="180" trigger="hover">
          <div>
            <p class="Offshelf-p" @click="shelf('3','下架所有重复课程')">下架所有重复课程</p>
            <p class="Offshelf-p" @click="shelf('2','下架本周和以后课程')">下架本周和以后课程</p>
            <p class="Offshelf-p" @click="shelf('1','仅下架本周课程')">仅下架本周课程</p>
          </div>
          <el-button slot="reference" class="Offshelf" type="text" icon="el-icon-sort">下架</el-button>
        </el-popover>
      </div>
    </el-dialog>
    <!-- 确认新增以下课程 -->
    <el-dialog :title="`确认${dialog_title}`" :visible.sync="dialogShow" width="30%">
      <div class="dialog-view">
        <div class="dialog-view-li">
          <span class="from-name">名称</span>
          <div class="from-text">{{formData.name}}</div>
        </div>
        <div class="dialog-view-li">
          <span class="from-name">教师</span>
          <div class="from-text">{{teacher_query(formData.userName)}}</div>
        </div>
        <div class="dialog-view-li">
          <span class="from-name">密码</span>
          <div class="from-text">{{formData.password}}</div>
        </div>
        <div class="dialog-view-li">
          <span class="from-name">时间</span>
          <div class="from-text">
            {{`${formData.day} ${formData.week}
            ${formData.start_Time}-${formData.end_Time} `}}
            <br />
            <p v-show="formData.isRepeat">
              <span>{{formData.repeatValue}}</span>
              <span v-if="formData.endRepetition=='2'">{{`于${formData.repeatTime}日结束`}}</span>
              <span v-else>{{`重复${formData.repeatEnd}次后结束`}}</span>
            </p>
          </div>
        </div>
        <div class="dialog-view-li">
          <span class="from-name">课程对象</span>
          <div class="from-text">
            <span v-if="formData.stuType == '1'">全体学生</span>
            <div v-else-if="formData.stuType == '2'">
              <span v-for="(item,index) in formData.stuGrade" :key="index">{{item}},</span>
            </div>
            <div v-else>
              <p v-for="(item,index) in sturdentObj" :key="index">
                <span>{{item.gradeName}}</span>
                <span>{{item.className}}</span>
              </p>
            </div>
            <span v-if="formData.teacherType == '1'">全体教师</span>
            <div v-else>
              <span v-for="(item,index) in teacherType" :key="index">{{item}},</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgShow" width="40%">
      <div class="banner-view">
        <el-carousel type="card" trigger="click" :autoplay="false" @change="choice" height="200px">
          <el-carousel-item v-for="item in kc_img" :key="item">
            <img :src="require(`@/assets/kc_img/${item}.jpg`)" alt />
          </el-carousel-item>
        </el-carousel>
        <div class="but_view">
          <el-button @click="imgShow=false">取消</el-button>
          <el-button type="primary" @click="choiceImg">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AddKc from "./add_kc";
import CourseList from "./dean_center";
import { today, deepCopy } from "@/utils/index.js";
import {
  adminInsert,
  timetable,
  timetableInfo,
  selectOne,
  course_Edit,
  showMenu,
} from "@/api/teacher.js";
import { queryGrade, queryClass } from "@/api/index.js";
import { mapStates, mapMutations } from "vuex";
export default {
  // 新增课程
  inheritAttrs: false,
  components: {},
  props: [],
  // 、、、、、、、、、、
  components: {
    AddKc,
    CourseList,
  },
  data() {
    return {
      dialogVisible: false,
      dialogShow: false,
      imgShow: false,
      days: today(new Date()),
      dialog_title: "新增课程",
      // 新增课程
      formData: {
        userName: undefined,
        // courseNum: null,
        name: undefined,
        password: undefined,
        imgUrl: "active",
        day: null,
        time: [],
        start_Time: "",
        end_Time: "",
        isRepeat: false,
        kcObject: false,
        // 重复类型
        repeatType: "2",
        repeatValue: "",
        endRepetition: "1",
        repeatEnd: 1,
        repeatTime: null,
        endRepetiText: "",
        stuType: null,
        stuGrade: [],
        stuGradeText: "",
        teacherType: null,
        week: "",
        entranceTime: "5",
        isRecord: "N",
        nickName: "",
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
        start_Time: [
          {
            required: true,
            message: "开始时间",
            trigger: "change",
          },
        ],
        end_Time: [
          {
            required: true,
            message: "结束时间",
            trigger: "change",
          },
        ],
        repeatEnd: [
          {
            required: true,
            message: "必填",
          },
        ],
        repeatTime: [
          {
            required: false,
          },
        ],
        isRepeat: [
          {
            required: false,
          },
        ],
      },
      userNameOptions: [],
      repeatTypeptions: [
        {
          label: "每天重复",
          value: "1",
        },
        {
          label: "每周重复",
          value: "2",
        },
        {
          label: "每两周重复",
          value: "3",
        },
        {
          label: "每月重复",
          value: "4",
        },
      ],
      isRepeatShow: false,
      iskcObjectShow: false,
      isGradeshow: false,
      isClassshow: false,
      isteachershow: false,
      grades: [
        {
          grade: "",
          classArr: [],
          classA: [],
        },
      ],
      gradeArr: [],
      grade: "一年级",
      classArr: [],
      classValue: "1班",
      teacherType: [],
      weekArr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      objList: [],
      sturdentObj: [],
      resDate: [],
      details: {},
      addFrom: {},
      editFrom: {},
      downType: "",
      kc_img: ["yw", "sx", "yy", "dl", "wl", "hx", "ls", "sw", "zz"],
      imgIndex: 0,
    };
  },
  computed: {},
  created() {
    this.query_Grade();
    this.get_timetable();
    this.save_showMenu();
  },
  methods: {
    onOpen() {},
    showDialog() {
      (this.formData = {
        userName: undefined,
        // courseNum: null,
        name: undefined,
        password: undefined,
        imgUrl: "active",
        day: null,
        time: [],
        start_Time: "",
        end_Time: "",
        isRepeat: false,
        kcObject: false,
        // 重复类型
        repeatType: "2",
        repeatValue: "",
        endRepetition: "1",
        repeatEnd: 1,
        repeatTime: null,
        endRepetiText: "",
        stuType: null,
        stuGrade: [],
        stuGradeText: "",
        teacherType: null,
        week: "",
        entranceTime: "5",
        isRecord: "N",
        nickName: "",
      }),
        (this.dialogVisible = true);
    },
    close() {
      this.dialogVisible = false;
    },
    shelf(s, name) {
      this.downType = s;
      this.$confirm("确定要" + name + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.editFrom = this.save_fromData("edit");
        this.editFrom.downType = s;
        this.save_course_Edit(this.editFrom);
      });
    },
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    handleClose() {
      if (this.dialog_title == "新增课程") {
        this.addFrom = this.save_fromData("admin");
        this.save_adminInsert(this.addFrom);
      } else if (this.dialog_title == "修改课程") {
        this.editFrom = this.save_fromData("edit");
        this.save_course_Edit(this.editFrom);
      }
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) {
          console.log("a");
        } else {
          if (this.formData.kcObject == false) {
            this.$message.error("请添加课程对象");
          } else {
            this.sturdent();
            this.dialogShow = true;
          }
        }
      });
    },
    imgUrlBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      return isRightSize;
    },
    // 班级选择-减
    reduceGrades(index) {
      this.grades.splice(index, 1);
    },
    // 班级选择-加
    addGrades(index) {
      this.grades.push({
        grade: "",
        classA: [],
        classArr: [],
      });
    },
    //学生对象-解析
    sturdent() {
      let datas = deepCopy(this.grades);
      let sturdent = [];
      datas.forEach((element) => {
        let objs = {};
        let classA = [];
        if (element.grade != "") {
          objs.type = "2";
          this.gradeArr.forEach((itemG) => {
            if (element.grade == itemG.id) {
              objs.gradeName = itemG.name;
            }
          });
          objs.className = element.classA.join(",");
          sturdent.push(objs);
        }
      });
      this.sturdentObj = sturdent;
      return sturdent;
    },
    teacher() {
      let datas = deepCopy(this.teacherType);
      if (datas.length > 0) {
      }
    },
    //参数整合
    save_fromData(name) {
      // name='admin' 管理员新增
      // name ='teacher' 教师新增
      // name = 'edit' '编辑'
      let froms = deepCopy(this.formData);
      console.log(froms);
      let datas = {};
      // this.objList =  [...this.sturdentObj,this.teacherType];
      datas.name = froms.name; //  名称
      // datas.courseNum = froms.courseNum;
      datas.startTime = froms.day + " " + froms.start_Time + ":00"; //开始时间
      datas.endTime = froms.day + " " + froms.end_Time + ":00"; //结束吧时间
      datas.imgUrl = froms.imgUrl; // 图片
      datas.password = froms.password; // 密码
      datas.schoolId = window.localStorage.getItem("schoolId"); //学校id
      datas.userName = froms.userName;
      datas.teacherName = this.teacher_query(froms.userName);
      datas.stuType = froms.stuType; //学生对象 1-全体学生 2-按年级划分 3-部分学生
      datas.type = "1"; //1-上架 2-下架
      datas.entranceTime = froms.entranceTime;
      datas.isRecord = froms.isRecord;
      datas.objList = [];
      if (froms.stuType != "1") {
        //判断对象。。
        datas.objList.push(...this.sturdentObj); //  部分课程对象。。（课程对象为部分班级或部分教师才有值）
        if (froms.stuType == "2") {
          let stuGrades = [];
          console.log();
          froms.stuGrade.forEach((element, index) => {
            let objtt = {};
            objtt.type = "2";
            objtt.gradeName = element;
            stuGrades.push(objtt);
            // datas.objList.push(...[obj]);
          });
          datas.objList = stuGrades;
        } else if (froms.stuType == "3") {
          let stuGrade = [];
          this.sturdentObj.forEach((element) => {
            stuGrade.push(`${element.gradeName}-${element.className}`);
          });
          console.log(stuGrade)
          // datas.stuGrade = stuGrade.join(",");
        }
      }
      datas.teacherType = froms.teacherType; //老师对象 1-全体老师 3-部分老师
      if (froms.teacherType == "3") {
        let teaType = [];
        this.userNameOptions.forEach((element) => {
          this.teacherType.forEach((item) => {
            if (item == element.nickName) {
              let objs = {
                type: "1",
                teacherName: element.nickName,
                userName: element.userName,
              };
              teaType.push(objs);
            }
          });
        });
        datas.objList.push(...teaType);
      }
      if (name == "admin") {
      } else if (name == "teacher") {
        datas.applyReason = ""; //申请理由
      } else {
        datas.id = froms.id;
        // datas.type = "",
        datas.auditStatus = froms.auditStatus; //审核状态
      }
      // 是否重复 Y-是 N-否
      datas.isRepeat = froms.isRepeat == true ? "Y" : "N";
      if (froms.isRepeat == true) {
        datas.repeatType = froms.repeatType;
        if (froms.endRepetition == "1") {
          datas.repeatEnd = froms.repeatEnd;
        } else {
          datas.repeatEnd = "D";
          datas.repeatTime = froms.repeatTime;
        }
      }
      console.log(datas);
      return datas;
    },
    //新增課程
    save_adminInsert(data) {
      adminInsert(data).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message({
            message: "课程新增成功",
            type: "success",
          });
          this.dialogShow = false;
          this.dialogVisible = false;
          this.$refs.CourseList.get_timetableInfo(
            today(this.days).substring(0, 10),
            this.grade,
            this.classValue
          );
        }
      });
    },
    //编辑课程
    save_course_Edit(data1) {
      course_Edit(data1).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "课程修改成功",
            type: "success",
          });
          this.dialogShow = false;
          this.dialogVisible = false;
          this.teacherType = [];
          this.$refs.CourseList.get_timetableInfo(
            today(this.days).substring(0, 10),
            this.grade,
            this.classValue
          );
        }
      });
    },
    // 查询所有教师
    save_showMenu() {
      showMenu().then((res) => {
        if (res.code == 200) {
          this.userNameOptions = res.data;
        }
      });
    },
    //查询所有年级
    query_Grade() {
      queryGrade().then((res) => {
        if (res.code == 200) {
          this.gradeArr = res.data;
          this.grade = this.gradeArr[0].name;
          console.log(this.grade);
          this.query_Class(this.gradeArr[0].id);
        }
      });
    },
    // 查询年级所在的班级
    query_Class(gradeId, index) {
      queryClass(gradeId).then((res) => {
        if (res.code == 200) {
          if (index != undefined) {
            this.grades[index].classArr = res.data;
          } else {
            this.classArr = res.data;
            this.classValue = this.classArr[0].name;
            this.get_timetable(today(new Date()));
          }
        }
      });
    },
    // 查询年级所在的班级
    async get_queryClass(gradeId) {
      let data;
      data = await queryClass(gradeId);
      return data;
    },
    // 监听年级变化
    gradeArrChange(index) {
      this.query_Class(this.grades[index].grade, index);
      this.grades[index].classA = [];
    },
    // 监听年级变化
    classArrChange(index) {
      // console.log(index,this.grades[index].classA)
    },
    // 查询日历
    get_timetable(day) {
      console.log(day);
      let data = `day=${day ? day : today(new Date())}&className=${
        this.classValue
      }&gradeName=${this.grade}`;
      timetable(data).then((res) => {
        if (res.code == 200) {
          this.resDate = res.data;
        }
      });
    },
    // 遍历 日历-当天是否有课
    dealMyDate(v) {
      let len = this.resDate.length;
      let res = "";
      for (let i = 0; i < len; i++) {
        if (this.resDate[i].day == v) {
          res = this.resDate[i].day;
          return true;
        }
      }
      return false;
    },
    // 查看课程详情
    get_selectOne(id) {
      selectOne(id).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = true;
          this.details = res.data;
          // this.formData = res.data;
          this.formData = this.detailsDeep(res.data);
        }
      });
    },
    // 接受课程详情数据处理
    detailsDeep(data) {
      let objs = {};
      objs.name = data.name;
      objs.userName = data.userName;
      objs.password = data.password;
      objs.id = data.id;
      // objs.courseNum = data.courseNum;
      objs.day = data.startTime.substring(0, 10);
      objs.start_Time = data.startTime.substring(11);
      objs.end_Time = data.endTime.substring(11);
      objs.isRecord = data.isRecord;
      objs.entranceTime = data.entranceTime;
      objs.isRepeat = data.isRepeat == "Y" ? true : false;
      objs.imgUrl = data.imgUrl == "" ? "" : data.imgUrl;
      if (data.repeatEnd == "D") {
        objs.repeatEnd = "D";
        objs.endRepetition = "2";
        objs.repeatTime = data.repeatTime;
      } else {
        objs.repeatEnd = data.repeatEnd;
        objs.endRepetition = "1";
      }
      objs.repeatType = data.repeatType;
      objs.schoolId = data.schoolId;
      objs.startTime = data.startTime;
      objs.teacherType = data.teacherType;
      objs.type = data.type;
      objs.stuType = data.stuType;
      objs.stuGrade = [];
      objs.kcObject = true;

      if (data.stuType != "1") {
        this.grades = [];

        data.objList.forEach((element, index) => {
          if (data.stuType == "2") {
            objs.stuGrade.push(element.gradeName);
          } else if (data.stuType == "3") {
            if (element.type == "2") {
              let grade = {};
              grade.grade = this.grade_query(element.gradeName);
              grade.id = this.grade_query(element.gradeName);
              this.get_queryClass(grade.id).then((data) => {
                console.log(data);
                grade.classArr = data.data;
              });
              grade.classA =
                element.className.indexOf(",") == -1
                  ? [element.className]
                  : element.className.split(",");
              console.log(grade);
              this.grades.push(grade);
            }
          }
        });
      }

      if (data.teacherType == "3") {
        this.teacherType = [];
        data.objList.forEach((element) => {
          if (element.type == "1") {
            this.teacherType.push(element.teacherName);
          }
          if (element.type == "2") {
          }
        });
      }

      // console.log(objs);
      return objs;
    },
    // 查询年级id
    grade_query(gradeName) {
      let id;
      let arr = deepCopy(this.gradeArr);
      arr.forEach((element) => {
        if (element.name == gradeName) {
          id = element.id;
        }
      });
      return id;
    },
    // 查询班级id
    class_query(classArr, name) {
      let id = [];
      classArr.forEach((element) => {
        name.forEach((item) => {
          if (element.name == item) {
            id.push(element.id);
          }
        });
      });
      return id;
    },
    choice(i) {
      this.imgIndex = i;
    },
    choiceImg() {
      this.formData.imgUrl = this.kc_img[this.imgIndex];
      this.imgShow = false;
      console.log(this.formData.imgUrl);
    },
    // 教师查询
    teacher_query(name) {
      let nickName = "";
      let arr = deepCopy(this.userNameOptions);
      arr.forEach((element) => {
        if (name == element.userName) {
          nickName = element.nickName;
        }
      });
      return nickName;
    },
    // 接收子组件传值-课表详情
    event(id, type) {
      this.get_selectOne(id);
      this.dialog_title = "修改课程";
    },
  },
  watch: {
    "formData.isRepeat": {
      handler: function (val) {
        this.isRepeatShow = val;
      },
      deep: true,
    },
    "formData.kcObject": {
      handler: function (val) {
        this.iskcObjectShow = val;
      },
      deep: true,
    },
    "formData.stuType": {
      handler: function (val) {
        this.isGradeshow = val == "2" ? true : false;
        this.isClassshow = val == "3" ? true : false;
        let objs = {
          grade: "",
          classArr: [],
          classA: [],
        };
        if (val == "3") {
          this.grades = this.grades.length == 0 ? [objs] : this.grades;
        }
      },
      deep: true,
    },
    "formData.teacherType": {
      handler: function (val) {
        this.isteachershow = val == "3" ? true : false;
      },
      deep: true,
    },
    "formData.day": {
      handler: function (val) {
        this.formData.week = this.weekArr[new Date(val).getDay()];
      },
      deep: true,
    },
    "formData.repeatType": {
      handler: function (val) {
        this.repeatTypeptions.forEach((element) => {
          if (val == element.value) {
            this.formData.repeatValue = element.label;
          }
        });
      },
      deep: true,
    },
    "formData.endRepetition": {
      handler: function (val) {
        if (val == "1") {
          // this.formData.endRepetiText = `重复${this.formData.repeatEnd}次后结束`
        } else {
          // this.formData.endRepetiText = `于${this.formData.repeatTime}日结束`
        }
      },
      deep: true,
    },
    "formData.stuGrade": {
      handler: function (val) {
        // console.log(val);
      },
      deep: true,
    },
    "grades.grade": {
      handler: function (val) {
        // console.log(val);
      },
      deep: true,
    },
    days(val) {
      // console.log(today(val))
      let dayActive = today(val).substring(0, 10);
      // this.days = today(val);
      this.get_timetable(dayActive);

      this.$refs.CourseList.get_timetableInfo(
        today(val).substring(0, 10),
        this.grade,
        this.classValue
      );
    },
    dialogVisible(val) {
      if (val == false) {
        this.dialog_title = "新增课程";
      }
    },
  },
};
</script>
<style lang="scss">
.dean_left {
  display: flex;
  .dean-container-date {
    width: 440px;
    .date-from {
      display: flex;
      justify-content: space-around;
    }

    .calendar-view {
      width: 440px;
      margin: 0 auto;
      // height: 300px;
      .el-calendar-table .el-calendar-day {
        padding: 5px;
        height: 60px !important;
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        font-size: 20px;
        .day_active {
          position: absolute;
          right: 5px;
          bottom: 5px;
          height: 10px;
          width: 10px;
          border-radius: 10px;
          background-color: #6dd739;
        }
      }
    }
  }
  .dean-container-Timetable {
    flex: 1;
    box-sizing: border-box;
    padding: 15px;
    padding-top: 100px;
  }
  .dialog-view {
    display: flex;
    flex-direction: column;
    .dialog-view-li {
      display: flex;
      min-height: 25px;
      margin-bottom: 10px;
      .from-name {
        display: inline-block;
        width: 70px;
        text-align: justify;
        text-align-last: justify;
        margin-right: 15px;
        line-height: 20px;
        color: #000000;
      }
      .from-text {
        flex: 1;
        line-height: 20px;
        div {
          p {
            margin: 0;
          }
        }
      }
    }
  }
  .classNum {
    width: 120px;
  }
  .teacherType-select {
    // width: 600px;
  }
  .Offshelf {
    margin-left: 50px;
  }
  .kc-img {
    display: flex;
    margin-bottom: 15px;
    span {
      width: 100px;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
      font-weight: 700;
    }
    .imgs {
      height: 100px;
      width: 150px;
      border-radius: 5px;
      margin-right: 20px;
    }
  }
  .but_view {
    display: flex;
    justify-content: center;
  }
}
.Offshelf-p {
  text-align: center !important;
  cursor: pointer !important;
  &:hover {
    color: #1890ff !important;
  }
}
.banner-view{
  width: 600px;
  margin: 0 auto;
}
</style>
