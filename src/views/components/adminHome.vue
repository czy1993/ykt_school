<template>
  <div id="admin_home">
    <!-- 开放巡检 -->
    <el-dialog
      @close="close"
      destroy-on-close
      title="开放今日巡检"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :model="inspectionFrom"
        status-icon
        :rules="rules"
        ref="inspectionFrom"
        label-width="135px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择开放课程范围" prop="type">
          <el-radio-group @change="change" v-model="inspectionFrom.type">
            <el-radio :label="'1'">全部课程</el-radio>
            <el-radio :label="'2'">部分年级课程</el-radio>
            <el-radio :label="'3'">部分班级课程</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="inspectionFrom.type=='2'" prop="gradeNames">
          <el-select v-model="inspectionFrom.gradeNames" multiple placeholder="请选择年级">
            <el-option
              v-for="item in gradeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <template v-if="inspectionFrom.type=='3'">
          <el-row v-for="(item,index) of inspectionFrom.checkList" :key="index">
            <el-col :span="11">
              <el-form-item
                :rules="{required: true, message: '年级不能为空', trigger: 'blur'}"
                :prop="'checkList.' + index + '.gradeName'"
              >
                <el-select @change="gradeChange" v-model="item.gradeName" placeholder="请选择年级">
                  <el-option
                    v-for="item in gradeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                :rules="{required: true, message: '班号不能为空', trigger: 'blur'}"
                :prop="'checkList.' + index + '.className'"
                label-width="10px"
              >
                <el-select v-model="item.className" placeholder="请选择班号">
                  <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="index===inspectionFrom.checkList.length-1" :span="1" :offset="1">
              <el-button @click.native="add" type="primary" icon="el-icon-plus" circle></el-button>
            </el-col>

            <el-col v-if="(inspectionFrom.checkList.length>1)" :span="1" :offset="1">
              <el-button @click.native="decrease(index)" type="primary" icon="el-icon-minus" circle></el-button>
            </el-col>
          </el-row>
        </template>

        <el-form-item label="设置巡检密码" prop="password">
          <div style="width:300px;">
            <el-input
              type="password"
              placeholder="请输入6位数字密码"
              v-model="inspectionFrom.password"
              show-password
              :maxlength="6"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="dialogVisible=false">取消</el-button>
          <el-button @click.native="confirm" type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 当前全部课程 -->
    <s-dialog v-model="allCourseVisible">
      <h3>当前全部课程</h3>
      <div v-if="currentCourses.length>0" class="_list _allList">
        <course-box
          v-for="course of currentCourses"
          :key="course.id"
          :title="`${course.gradeClassName||''}    ${' '+course.name}`"
          :img="course.imgUrl"
        >
          <template v-slot:right>
            <el-button type="warning" @click.native="goRoom(course)" round>进入直播教室</el-button>
          </template>
          <div class="card_message">
            <p>
              <span>讲课教师：{{course.nickName}}</span>
              <span>开课时间：{{course.courseTime}}</span>
            </p>
            <p>
              上课人数：已到
              <i>{{course.comeCourseNum}}</i>人/应到
              <i>{{course.courseNum}}</i>人
              <el-popover
                popper-class="details"
                @show="showDetail(course.courseArrangeId)"
                placement="right"
                trigger="click"
              >
                <ul
                  v-loading="loading"
                  class="details"
                  style="max-height:180px;overflow:auto;min-height:80px"
                >
                  <li style="margin:5px;" v-for="(item,index) of details" :key="index">
                    <span
                      style="margin-right:10px;"
                      v-for="(key) of Object.keys(item)"
                      :key="key"
                    >{{item[key]}}</span>
                  </li>
                </ul>
                <span
                  v-if="course.comeCourseNum!=course.courseNum"
                  slot="reference"
                  class="_detail"
                >缺课详情</span>
              </el-popover>
            </p>
            <p>
              <count-down :time="course.countDown"></count-down>
            </p>
          </div>
        </course-box>
      </div>
      <div v-else class="_tip">暂无课程</div>
    </s-dialog>

    <!-- 全部听课 -->
    <s-dialog v-model="allListenCourseVisible">
      <h3>全部听课</h3>
      <div v-if="listenCourses.length>0" class="_list _allList">
        <course-box
          v-for="course of listenCourses"
          :key="course.id"
          :title="course.name"
          :img="course.imgUrl"
        >
          <template v-slot:right>
            <el-button
              :disabled="!toLive(course.startTime,course.entranceTime)"
              type="warning"
              round
              @click.native="listenRoom(course)"
            >进入直播教室</el-button>
          </template>
          <div class="card_message">
            <p>
              <span>讲课教师：{{course.nickName}}</span>
              <span>开课时间：{{course.courseTime}}</span>
            </p>
            <p>
              上课人数：已到
              <i>{{course.comeCourseNum}}</i>人/应到
              <i>{{course.courseNum}}</i>人
              <!-- <span class="_detail">缺课详情</span> -->
            </p>
            <p>
              距离开课时间：
              <count-down
                @end="initData"
                @bindTime="initData"
                :bindTime="course.entranceTime*60*1000"
                :time="course.countDown"
              ></count-down>
            </p>
          </div>
        </course-box>
      </div>
      <div v-else class="_tip">暂无课程</div>
    </s-dialog>
    <!-- 下节全部课程 -->
    <s-dialog v-model="allNextCourseVisible">
      <h3>下节全部课程</h3>
      <div class="_list" v-if="nextCourses.length>0">
        <course-box
          v-for="course of nextCourses.slice(0,4)"
          :key="course.id"
          :title="`${course.gradeClassName||''}    ${' '+course.name}`"
          :img="course.imgUrl"
        >
          <template v-slot:right>
            <el-button disabled type="warning" round>进入直播教室</el-button>
          </template>
          <div class="card_message">
            <p>
              <span>讲课教师：{{course.nickName}}</span>
              <span>开课时间：{{course.courseTime}}</span>
            </p>
            <p>
              上课人数：已到
              <i>{{course.comeCourseNum}}</i>人/应到
              <i>{{course.courseNum}}</i>人
            </p>
            <p>
              距离开课时间：
              <!-- <i>{{course.countDown}}</i> -->
              <count-down @end="initData" :time="course.countDown"></count-down>
            </p>
          </div>
        </course-box>
      </div>
      <div v-else class="_tip">暂无课程</div>
    </s-dialog>

    <home-nav :title="'当前课程'">
      <template v-slot:right>
        <el-button v-hasPermi="['system:manger:checkUp']" @click="open" type="primary" round>开放今日巡检</el-button>
      </template>
      <template v-slot:left>
        <el-button @click.native="allCourseVisible=true" round>查看全部</el-button>
      </template>
    </home-nav>
    <div v-if="currentCourses.length>0" class="_list">
      <course-box
        v-for="course of currentCourses.slice(0,4)"
        :key="course.id"
        :title="`${course.gradeClassName||''}    ${' '+course.name}`"
        :img="course.imgUrl"
      >
        <template v-slot:right>
          <el-button type="warning" @click.native="goRoom(course)" round>进入直播教室</el-button>
        </template>
        <div class="card_message">
          <p>
            <span>讲课教师：{{course.nickName}}</span>
            <span>开课时间：{{course.courseTime}}</span>
          </p>
          <p>
            上课人数：已到
            <i>{{course.comeCourseNum}}</i>人/应到
            <i>{{course.courseNum}}</i>人
            <!-- <span class="_detail">缺课详情</span> -->

            <el-popover
              popper-class="details"
              @show="showDetail(course.courseArrangeId)"
              placement="right"
              trigger="click"
              transition="none"
            >
              <ul
                v-loading="loading"
                class="details"
                style="max-height:180px;overflow:auto;min-height:80px;"
              >
                <li style="margin:5px;" v-for="(item,index) of details" :key="index">
                  <span
                    style="margin-right:10px;"
                    v-for="(key) of Object.keys(item)"
                    :key="key"
                  >{{item[key]}}</span>
                </li>
              </ul>
              <span
                v-if="course.comeCourseNum!=course.courseNum"
                slot="reference"
                class="_detail"
              >缺课详情</span>
            </el-popover>
          </p>
          <p>
            <count-down :time="course.countDown"></count-down>
          </p>
        </div>
      </course-box>
    </div>
    <div v-else class="_tip">暂无课程</div>

    <home-nav :title="'听课课表'">
      <template v-slot:left>
        <el-button @click.native="allListenCourseVisible=true" round>查看全部</el-button>
      </template>
    </home-nav>

    <div v-if="listenCourses.length>0" class="_list">
      <course-box
        v-for="course of listenCourses.slice(0,4)"
        :key="course.id"
        :title="course.name"
        :img="course.imgUrl"
      >
        <template v-slot:right>
          <el-button
            type="warning"
            :disabled="!toLive(course.startTime,course.entranceTime)"
            @click.native="listenRoom(course)"
            round
          >进入直播教室</el-button>
        </template>
        <div class="card_message">
          <p>
            <span>讲课教师：{{course.nickName}}</span>
            <span>开课时间：{{course.courseTime}}</span>
          </p>
          <p>
            上课人数：已到
            <i>{{course.comeCourseNum}}</i>人/应到
            <i>{{course.courseNum}}</i>人
            <!-- <span class="_detail">缺课详情</span> -->
          </p>
          <p>
            距离开课时间：
            <count-down
              @end="initData"
              @bindTime="initData"
              :bindTime="course.entranceTime*60*1000"
              :time="course.countDown"
            ></count-down>
          </p>
        </div>
      </course-box>
    </div>
    <div v-else class="_tip">暂无课程</div>

    <home-nav :title="'下节课程'">
      <template v-slot:left>
        <el-button @click.native="allNextCourseVisible=true" round>查看全部</el-button>
      </template>
    </home-nav>
    <div class="_list" v-if="nextCourses.length>0">
      <course-box
        v-for="course of nextCourses.slice(0,4)"
        :key="course.id"
        :title="`${course.gradeClassName||''}    ${' '+course.name}`"
        :img="course.imgUrl"
      >
        <template v-slot:right>
          <el-button disabled type="warning" round>进入直播教室</el-button>
        </template>
        <div class="card_message">
          <p>
            <span>讲课教师：{{course.nickName}}</span>
            <span>开课时间：{{course.courseTime}}</span>
          </p>
          <p>
            上课人数：已到
            <i>{{course.comeCourseNum}}</i>人/应到
            <i>{{course.courseNum}}</i>人
          </p>
          <p>
            距离开课时间：
            <count-down @end="initData" :time="course.countDown"></count-down>
          </p>
        </div>
      </course-box>
    </div>
    <div v-else class="_tip">暂无课程</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { queryGrade, queryClass } from "@/api";
import { courseCheckSet, queryAbsenteeism } from "@/api/home";
import { haveChildMenu } from "@/utils";
import { getToken } from "@/utils/auth";
import { roomUrl } from "@/utils/env";
export default {
  data() {
    return {
      dialogVisible: false,
      allCourseVisible: false,
      allNextCourseVisible: false,
      allListenCourseVisible: false,
      gradeList: [],
      classList: [],
      inspectionFrom: {
        type: "1",
        password: "",
        gradeNames: [],
        checkList: [
          {
            gradeName: "",
            className: ""
          }
        ]
      },
      rules: {
        type: [
          { required: true, message: "请选择开放课程范围", trigger: "blur" }
        ],
        gradeNames: [
          { required: true, message: "请选择年级", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      permission: [],
      details: [],
      loading: true
    };
  },
  components: {
    "home-nav": () => import("./HomeNav.vue"),
    "course-box": () => import("./CourseBox.vue"),
    "s-dialog": () => import("./Dialog.vue"),
    CountDown: () => import("@/components/CountDown")
  },
  computed: {
    ...mapState("home", ["nextCourses", "todayCourses", "listenCourses"]),
    ...mapGetters("home", ["currentCourses"]),
    ...mapState({
      menuList: state => state.user.menuList
    })
  },
  created() {
    this.initData();
    this.permission = haveChildMenu("首页")(this.menuList);
  },
  methods: {
    ...mapActions("home", [
      "queryTeaTodayCourse",
      "queryNextCourse",
      "queryTeaListenCourse"
    ]),
    initData() {
      this.queryTeaTodayCourse();
      this.queryNextCourse();
      this.queryTeaListenCourse();
      queryGrade().then(res => {
        if (res.code == 200) {
          this.gradeList = res.data;
        }
      });
    },
    change(val) {
      this.inspectionFrom.gradeNames = [];
      this.inspectionFrom.checkList = [
        {
          gradeName: "",
          className: ""
        }
      ];
      this.$refs["inspectionFrom"].clearValidate();
    },
    open() {
      this.dialogVisible = true;
    },
    close() {
      this.inspectionFrom = {
        type: "1",
        password: "",
        gradeNames: [],
        checkList: [
          {
            gradeName: "",
            className: ""
          }
        ]
      };
    },
    showDetail(id) {
      this.loading = true;
      this.details = [];
      queryAbsenteeism(id).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.details = res.rows;
        }
      }).catch(()=>{
         this.loading = false;
      })
    },
    decrease(index) {
      this.inspectionFrom.checkList.splice(index, 1);
    },
    gradeChange(val) {
      let grade = this.gradeList.find(item => {
        return item.name === val;
      });
      if (grade) {
        queryClass(grade.id).then(res => {
          if (res.code == 200) {
            this.classList = res.data;
          }
        });
      }
    },
    add() {
      this.inspectionFrom.checkList.push({
        gradeName: "",
        className: ""
      });
    },
    confirm() {
      this.$refs["inspectionFrom"].validate(valid => {
        if (valid) {
          let checkList = [];
          if (this.inspectionFrom.type == "2") {
            checkList = this.inspectionFrom.gradeNames.reduce((acc, cur) => {
              acc.push({
                gradeName: cur,
                className: ""
              });
              return acc;
            }, []);
          } else if (this.inspectionFrom.type == "3") {
            checkList = this.inspectionFrom.checkList;
          }
          courseCheckSet({
            type: this.inspectionFrom.type,
            password: this.inspectionFrom.password,
            checkList
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.dialogVisible = false;
              this.initData();
            }
          });
        } else {
          return false;
        }
      });
    },
    goRoom(course) {
      let type = course.teacherType.slice(0, -1);
      if (type === "teacher") {
        type = "classroom";
      }
      let params = {
        token: getToken(),
        roomId: course.id + "",
        courseArrangeId: course.courseArrangeId + "",
        roleType: "1",
        pathname: `/${type}`
      };

      params = window.btoa(JSON.stringify(params));
      window.open(roomUrl + `/devices-check` + `?params=` + params);
    },
    listenRoom(course) {
      let params = {
        token: getToken(),
        roomId: course.id + "",
        courseArrangeId: course.courseArrangeId + "",
        roleType: "1",
        pathname: "/watch"
      };
      params = window.btoa(JSON.stringify(params));
      window.open(roomUrl + "/devices-check" + `?params=` + params);
    },
    toLive(time, entranceTime) {
      if (new Date(time).getTime() - Date.now() < entranceTime * 60 * 1000) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#admin_home {
  ._list {
    display: flex;
    flex-wrap: wrap;
    @media screen and (max-width: 1300px) {
      justify-content: center;
    }
    & > div {
      margin: 10px;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
    }
  }
  ._allList {
    flex-wrap: wrap;
  }
  ._tip {
    font-size: 100px;
    font-weight: bold;
    color: rgb(163, 163, 163);
    text-align: center;
    padding: 80px;
  }
  .card_message {
    & > p:nth-of-type(1) {
      span {
        margin-right: 20px;
      }
    }
    & > p {
      margin: 12px 0;
      color: #6b6b6b;
      i {
        color: #ff7300;
        font-style: normal;
        font-weight: bold;
      }
      .setting {
        float: right;
        font-size: 21px;
        cursor: pointer;
      }
    }
    ._detail {
      color: #3a9def;
      cursor: pointer;
      margin-left: 20px;
    }
    .details {
      max-height: 200px;
      li {
        span {
          margin: 10px;
        }
      }
    }
  }
}
</style>
