<template>
  <div class="transfer">
    <div class="transfer-header">
      <div class="header-from">
        <h4>调课管理</h4>
        <el-select v-model="type" clearable placeholder="申请类型">
          <el-option value="1" label="课程上架"></el-option>
          <el-option value="2" label="课程下架"></el-option>
        </el-select>
        <el-select v-model="auditStatus" clearable placeholder="申请结果">
          <el-option value="1" label="待批准"></el-option>
          <el-option value="2" label="未通过"></el-option>
          <el-option value="3" label="已通过"></el-option>
        </el-select>
      </div>
      <div>
        <el-button type="primary" @click="dialogVisible2=true">课程上架申请</el-button>
        <el-button type="primary" @click="dialogVisible1=true">课程下架申请</el-button>
      </div>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="applyTime" label="申请时间"></el-table-column>
      <el-table-column prop="type" label="申请类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='2'">课程下架</span>
          <span v-else>课程上架</span>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" label="申请结果">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus=='1'">待批准</span>
          <span v-else-if="scope.row.auditStatus=='2'">未通过</span>
          <span class="blue" v-else>已通过</span>
        </template>
      </el-table-column>
      <el-table-column prop="courseId" label="详情">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row.id,scope.row.type)">详情</el-button>
        </template>
      </el-table-column>
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
    <!-- 课程详情 -->
    <el-dialog title="课程详情" :visible.sync="dialogVisible" width="25%">
      <div class="details-dialog">
        <img
          class="imgUrl"
          v-if="detailType=='1'"
          :src="require(`@/assets/kc_img/${details.imgUrl}.jpg`)"
          alt
        />
        <div>
          <span>申请时间：</span>
          {{details.applyTime}}
        </div>
        <div>
          <span>申请班级：</span>
          {{details.gradeClass}}
        </div>
        <div>
          <span>课程名称：</span>
          {{details.applyName}}
        </div>
        <div>
          <span>上课时间：</span>
          <div>
            {{details.week}},{{details.start}}-{{details.end}}
            <br />
            {{details.repeatText}}
          </div>
        </div>
        <div v-if="detailType=='2'">
          <span>下架范围：</span>
          {{details.downType}}
        </div>
        <div>
          <span>申请理由：</span>
          {{details.applyReason}}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 课程下架 -->
    <el-dialog
      title="课程下架申请"
      :visible.sync="dialogVisible1"
      width="35%"
      :before-close="handleClose"
    >
      <div class="lower-dialog">
        <div class="lower-view">
          <span class="from-name">
            <span class="red">*</span>选择班级:
          </span>
          <div class="from-view">
            <el-select
              class="nj-select"
              v-model="grade"
              @change="get_queryClass()"
              placeholder="年级"
            >
              <el-option key="All" label="全部" value="All"></el-option>
              <el-option
                v-for="item in gradeArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select class="nj-select" v-model="classValue" placeholder="班级">
              <el-option key="All" label="全部" value="All"></el-option>
              <el-option
                v-for="item in classArr"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="lower-view">
          <span class="from-name">
            <span class="red">*</span>选择日期:
          </span>
          <div class="from-view">
            <el-date-picker
              class="from-select"
              v-model="days"
              type="date"
              value-format="yyyy-MM-dd"
              @change="get_teacherCourseQuery()"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="lower-view">
          <span class="from-name">
            <span class="red">*</span>选择课程:
          </span>
          <div class="from-view">
            <el-select class="from-select" v-model="courseId" placeholder="选择课程">
              <el-option v-for="item in therKb" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <div class="lower-view">
          <span class="from-name">
            <span class="red">*</span>下架类型:
          </span>
          <div class="from-view">
            <el-select class="from-select" v-model="downType" placeholder="下架类型">
              <el-option label="仅下架本周课程" value="1"></el-option>
              <el-option label="下架本周以后课程" value="2"></el-option>
              <el-option label="下架所有重复该科" value="3"></el-option>
            </el-select>
          </div>
        </div>
        <div class="lower-view">
          <span class="from-name">
            <span class="red">*</span>下架理由:
          </span>
          <div class="from-view">
            <el-input
              class="from-select"
              type="textarea"
              :rows="2"
              placeholder="下架理由"
              v-model="applyReason"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="applyDown">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增上架申请 -->
    <el-dialog
      v-bind="$attrs"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      :title="dialog_title"
    >
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="16">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入课程名称"
                clearable
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="10">
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
                  :label="`${item.nickName}(${item.userName})`"
                  :value="item.userName"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="16">
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
                  end: '20:30'
                }"
            ></el-time-select>
            <el-time-select
              class="classNum"
              placeholder="结束时间"
              v-model="formData.end_Time"
              :picker-options="{
                  start: '06:00',
                  step: '00:5',
                  end: '21:15',
                  minTime: formData.start_Time
                }"
            ></el-time-select>
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
                  <el-select multiple v-model="grades[index].classA" placeholder="请选择">
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
                <!-- <el-row>
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
                      :label="item.nickName"
                      :value="item.nickName"
                    ></el-option>
                  </el-select>
                </el-row>-->
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="申请理由" prop="applyReason">
              <el-input
                type="textarea"
                :rows="2"
                v-model="formData.applyReason"
                placeholder="申请理由"
                clearable
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow">
      <el-carousel type="card" trigger="click" :autoplay="false" @change="choice" height="200px">
        <el-carousel-item v-for="item in kc_img" :key="item">
          <img :src="require(`@/assets/kc_img/${item}.jpg`)" alt />
          <!-- <img src="../../../../assets/kc_img/yw.jpg" alt=""> -->
        </el-carousel-item>
      </el-carousel>
      <div class="but_view">
        <el-button @click="imgShow=false">取消</el-button>
        <el-button type="primary" @click="choiceImg">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  teacherCourseList,
  teacherCourseDetail,
  teacherCourseQuery,
  teacherCourseDown,
  showMenu,
  teacherInsert,
} from "@/api/teacher.js";
import { queryGrade, queryClass } from "@/api/index.js";
import { today, deepCopy } from "@/utils/index.js";
import { getUserProfile } from "@/api/system/user";
export default {
  data() {
    return {
      user: {},
      type: "",
      auditStatus: "",
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      courseId: "",
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      details: {},
      weekArr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
      ],
      gradeArr: [],
      grade: "All",
      gradeName: "All",
      classArr: [],
      classValue: "",
      days: "",
      therKb: [],
      courseId: "",
      downType: "",
      applyReason: "",
      formData: {
        applyReason: "",
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
        applyReason: [
          {
            required: true,
            message: "请填写上架理由",
            trigger: "blur",
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
      },
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
      userNameOptions: [],
      isRepeatShow: false,
      iskcObjectShow: false,
      isGradeshow: false,
      isClassshow: false,
      isteachershow: false,
      imgShow: false,
      grades: [
        {
          grade: "",
          classArr: [],
          classA: [],
        },
      ],
      teacherType: [],
      dialog_title: "课程上架申请",
      kc_img: ["yw", "sx", "yy", "dl", "wl", "hx", "ls", "sw", "zz"],
      imgIndex: 0,
      sturdentObj: [],
      detailType: "2",
    };
  },
  created() {
    this.get_teacherCourseList();
    this.get_queryGrade();
    this.save_showMenu();
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.get_teacherCourseList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.get_teacherCourseList();
    },
    get_teacherCourseList() {
      let data = `pageNum=${this.pageNum}&pageSize=${this.pageSize}&auditStatus=${this.auditStatus}&type=${this.type}`;
      teacherCourseList(data).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    //查看详情
    get_teacherCourseDetail() {
      teacherCourseDetail(this.courseId).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = true;
          this.details = res.data;
          this.details.week = this.weekArr[
            new Date(this.details.schoolTime.substring(0, 10)).getDay()
          ];
          this.details.start = this.details.schoolTime.substring(11, 16);
          this.details.end = this.details.schoolTime.substring(20, 25);
        }
      });
    },
    detail(id, type) {
      this.courseId = id;
      this.detailType = type;
      this.get_teacherCourseDetail();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    get_queryGrade() {
      queryGrade().then((res) => {
        if (res.code == 200) {
          this.gradeArr = res.data;
        }
      });
    },
    get_queryClass() {
      this.classValue = "";
      this.days = "";
      if (this.grade != "All") {
        queryClass(this.grade).then((res) => {
          if (res.code == 200) {
            this.classArr = res.data;
          }
        });
        this.gradeName = this.grade_deep(this.grade);
      } else {
        this.gradeName = "All";
      }
    },
    get_teacherCourseQuery() {
      // let gradeName = this.grade_deep(this.grade)
      let data = `gradeName=${this.gradeName}&className=${this.classValue}&date=${this.days}`;
      teacherCourseQuery(data).then((res) => {
        if (res.code == 200) {
          this.therKb = res.data;
          this.therKb.forEach((element) => {
            element.label =
              element.startTime.substring(11, 16) +
              "-" +
              element.endTime.substring(11, 16) +
              " " +
              element.name +
              " " +
              element.teacherName;
          });
        }
      });
    },
    // 根据年级id 差名称
    grade_deep(id) {
      let name;
      let data = deepCopy(this.gradeArr);
      data.forEach((element) => {
        if (id == element.id) {
          name = element.name;
        }
      });
      return name;
    },
    //下架申请
    applyDown() {
      if (this.gradeName == "" || this.classValue == "" || this.days == "") {
        this.$message.error("请先选择班级和日期");
      } else if (this.courseId == "") {
        this.$message.error("请选择要下架的课程");
      } else if (this.downType == "") {
        this.$message.error("请选择需要下架的课程");
      } else if (this.applyReason == "") {
        this.$message.error("请说明下架理由");
      } else {
        this.get_teacherCourseDown();
      }
    },
    get_teacherCourseDown() {
      // console.log(this.applyReason,this.courseId,this.downType)
      teacherCourseDown({
        applyReason: this.applyReason,
        courseId: this.courseId,
        downType: this.downType,
      }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "下架申请成功",
            type: "success",
            onClose: () => {
              this.dialogVisible1 = false;
            },
          });
        }
      });
    },
    // 上架申请
    onOpen() {},
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.dialogVisible2 = false;
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
            let fromData = this.save_fromData();
            this.get_teacherInsert(fromData);
          }
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
    choice(i) {
      this.imgIndex = i;
    },
    choiceImg() {
      this.formData.imgUrl = this.kc_img[this.imgIndex];
      this.imgShow = false;
      console.log(this.formData.imgUrl);
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
    // 查询年级所在的班级
    query_Class(gradeId, index) {
      queryClass(gradeId).then((res) => {
        if (res.code == 200) {
          if (index != undefined) {
            this.grades[index].classArr = res.data;
          } else {
            this.classArr = res.data;
            this.classValue = this.classArr[0].name;
          }
        }
      });
    },
    // 监听年级变化
    gradeArrChange(index) {
      this.query_Class(this.grades[index].grade, index);
      this.grades[index].classA = [];
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
    //参数整合
    save_fromData() {
      let froms = deepCopy(this.formData);
      console.log(froms);
      let datas = {};
      datas.name = froms.name; //  名称
      datas.startTime = froms.day + " " + froms.start_Time + ":00"; //开始时间
      datas.endTime = froms.day + " " + froms.end_Time + ":00"; //结束吧时间
      datas.imgUrl = froms.imgUrl; // 图片
      datas.password = froms.password; // 密码
      datas.schoolId = window.localStorage.getItem("schoolId"); //学校id
      datas.userName = this.user.userName;
      // datas.teacherName = this.teacher_query(froms.userName);
      datas.stuType = froms.stuType; //学生对象 1-全体学生 2-按年级划分 3-部分学生
      datas.type = "1"; //1-上架 2-下架
      datas.entranceTime = froms.entranceTime;
      datas.isRecord = froms.isRecord;
      datas.applyReason = froms.applyReason;
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
          });
          datas.objList.push(...stuGrades);
        } else if (froms.stuType == "3") {
          let stuGrade = [];
          this.sturdentObj.forEach((element) => {
            stuGrade.push(`${element.gradeName}-${element.className}`);
          });
        }
      }
      // datas.teacherType = froms.teacherType; //老师对象 1-全体老师 3-部分老师
      // if (froms.teacherType == "3") {
      //   let teaType = [];
      //   this.userNameOptions.forEach((element) => {
      //     this.teacherType.forEach((item) => {
      //       if (item == element.nickName) {
      //         let objs = {
      //           type: "1",
      //           teacherName: element.nickName,
      //           userName: element.userName,
      //         };
      //         teaType.push(objs);
      //       }
      //     });
      //   });
      //   datas.objList.push(...teaType);
      // }
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
    get_teacherInsert(data) {
      teacherInsert(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "已提交申请",
            type: "success",
            onClose: () => {
              this.dialogVisible2 = false;
              this.formData.imgUrl = "active";
              this.$parent.fatherMethod();
            },
          });
        }
      });
    },
  },
  watch: {
    type() {
      this.get_teacherCourseList();
    },
    auditStatus() {
      this.get_teacherCourseList();
    },
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
    dialogVisible1() {
      this.applyReason = "";
      this.courseId = "";
      this.downType = "";
      this.gradeName = "";
      this.classValue = "";
      this.days = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.transfer {
  margin-right: 10px;
  box-sizing: border-box;
  padding: 5px 20px;
  border-bottom: 1px solid #eceef1;
  border-top: 1px solid #eceef1;
  box-shadow: 0px 1px 3px 0px #eceef1;
  .transfer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    .header-from {
      display: flex;
      align-items: center;
      h4 {
        margin-right: 40px;
        padding: 6px;
      }
      .el-select {
        margin-right: 15px;
      }
    }
  }
  .details-dialog {
    width: 260px;
    margin: 0 auto;
    .imgUrl {
      height: 120px;
      width: 250px;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    div {
      display: flex;
      margin-bottom: 10px;
      span {
        color: #000000;
        font-weight: 500;
      }
    }
  }
  .lower-dialog {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    .lower-view {
      display: flex;
      margin-bottom: 10px;
      .from-name {
        width: 80px;
        line-height: 30px;
        display: flex;
        align-items: center;
      }
      .from-view {
        display: flex;
        .nj-select {
          width: 140px;
          margin-right: 10px;
        }
        .from-select {
          width: 290px;
        }
      }
    }
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
  .classNum {
    width: 120px;
  }
  .but_view {
    display: flex;
    justify-content: center;
  }
}
</style>