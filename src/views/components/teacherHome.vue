<template>
  <div id="teacherHome">
    <el-dialog title="直播设置" :visible.sync="dialogVisible" width="400px">
      <ul class="liveSetting">
        <li>
          <span>直播回放录制</span>
          <el-radio-group v-model="isRecord">
            <el-radio :label="'Y'">开启</el-radio>
            <el-radio :label="'N'">关闭</el-radio>
          </el-radio-group>
        </li>
        <li>
          <span>提前入场时间</span>
          <el-radio-group v-model="entranceTime">
            <el-radio :label="'10'">10min</el-radio>
            <el-radio :label="'5'">5min</el-radio>
            <el-radio :label="''">无</el-radio>
          </el-radio-group>
        </li>
      </ul>
      <footer slot="footer">
        <el-button @click.native="dialogVisible=false">取消</el-button>
        <el-button @click.native="confirm" type="primary">确认</el-button>
      </footer>
    </el-dialog>

    <!-- 上课全部课表 -->
    <s-dialog v-model="allCourseVisible">
      <h3>全部课表</h3>
      <div v-if="todayCourses.length>0" class="_list _allList">
        <course-box
          v-for="course of todayCourses"
          :key="course.id"
          :title="`${course.gradeClassName||''}    ${' '+course.name}`"
          :img="course.imgUrl"
        >
          <template v-slot:right>
            <el-button
              :disabled="!toLive(course.startTime,course.entranceTime)"
              type="warning"
              round
              @click.native="goRoom(course)"
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
              <span
                @click="toSet(course)"
                v-if="course.countDown!='上课中'"
                class="el-icon-s-tools setting"
              ></span>
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

    <home-nav :title="'上课课表'">
      <template v-slot:left>
        <el-button @click.native="allCourseVisible=true" round>查看全部</el-button>
      </template>
    </home-nav>

    <div v-if="todayCourses.length>0" class="_list">
      <course-box
        v-for="course of todayCourses.slice(0,4)"
        :key="course.id"
        :title="`${course.gradeClassName||''}    ${' '+course.name}`"
        :img="course.imgUrl"
      >
        <template v-slot:right>
          <el-button
            :disabled="!toLive(course.startTime,course.entranceTime)"
            type="warning"
            round
            @click.native="goRoom(course)"
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

            <span
              @click="toSet(course)"
              v-if="course.countDown!='上课中'"
              class="el-icon-s-tools setting"
            ></span>
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

    <home-nav :title="'我的班级'"></home-nav>
    <div v-if="myClasses.length>0" class="_list _allList">
      <class-box :title="item.gradeClassName||''" v-for="item of myClasses" :key="item.id">
        <template v-slot:right>
          <el-popover
            popper-class="details"
            @show="showDetail(item.courseArrangeId)"
            placement="right"
            trigger="click"
              transition="none"
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
            <el-button
              v-if="item.comeCourseNum!=item.courseNum"
              slot="reference"
              type="primary"
              round
            >缺课详情</el-button>
          </el-popover>
        </template>
        <div class="card_message">
          <p>
            <span>科目：{{item.name}}</span>
            <span>教师：{{item.nickName}}</span>
          </p>
          <p>
            上课人数：实到
            <i>{{item.comeCourseNum}}</i>人/应到
            <i>{{item.courseNum}}</i>人
          </p>
          <p>
            <count-down @end="initData" :time="item.countDown"></count-down>
          </p>
        </div>
      </class-box>
    </div>
    <div v-else class="_tip">暂无班级</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { queryGrade, queryClass } from "@/api";
import { courseCheckSet, courseVideoSet, queryAbsenteeism } from "@/api/home";
import { getToken } from "@/utils/auth";
import { roomUrl } from "@/utils/env";
export default {
  data() {
    return {
      courseId: "",
      dialogVisible: false,
      isRecord: "",
      entranceTime: "",
      allCourseVisible: false,
      allListenCourseVisible: false,
      details: [],
      loading: false
    };
  },
  computed: {
    ...mapState("home", ["todayCourses", "listenCourses", "myClasses"])
  },
  components: {
    "home-nav": () => import("./HomeNav.vue"),
    "course-box": () => import("./CourseBox.vue"),
    "s-dialog": () => import("./Dialog.vue"),
    "class-box": () => import("./ClassBox.vue"),
    CountDown: () => import("@/components/CountDown")
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("home", [
      "queryTeaTodayCourse",
      "queryTeaListenCourse",
      "queryTeaOwnClass"
    ]),
    initData() {
      this.queryTeaTodayCourse();
      this.queryTeaListenCourse();
      this.queryTeaOwnClass();
    },
    toLive(time, entranceTime) {
      if (new Date(time).getTime() - Date.now() < entranceTime * 60 * 1000) {
        return true;
      } else {
        return false;
      }
    },
    toSet(obj) {
      this.courseId = obj.id;
      this.isRecord = obj.isRecord;
      this.entranceTime = obj.entranceTime;

      this.dialogVisible = true;
    },
    showDetail(id) {
      this.loading = true;
      this.details = [];
      queryAbsenteeism(id)
        .then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.details = res.rows;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    confirm() {
      courseVideoSet({
        courseId: this.courseId,
        entranceTime: this.entranceTime,
        isRecord: this.isRecord
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("设置成功");
          this.dialogVisible = false;
          this.initData();
        }
      });
    },
    goRoom(course) {
      let params = {
        token: getToken(),
        roomId: course.id + "",
        courseArrangeId: course.courseArrangeId + "",
        roleType: "1",
        pathname: "/classroom"
      };
      params = window.btoa(JSON.stringify(params));
      window.open(roomUrl + "/devices-check" + `?params=` + params);
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
    }
  }
};
</script>

<style lang="scss" scoped>
#teacherHome {
  .liveSetting {
    li {
      margin: 20px 0;
      font-weight: bold;
      span {
        margin-right: 15px;
      }
    }
  }
  ._list {
    display: flex;
    @media screen and (max-width: 1300px) {
      flex-wrap: wrap;
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
  }
}
</style>
