<template>
  <div id="inspectionPage">
    <nav-bar></nav-bar>
    <div class="container">
      <el-alert :closable="false" title="欢迎莅临我校巡检！当前已展示正在上课的所有课程情况" type="info"></el-alert>
      <h3>当前正在上课课程</h3>
      <div class="course_lists">
        <div v-if="courseList.length>0" class="_list _allList">
          <course-box
            v-for="course of courseList"
            :key="course.id"
            :title="`${course.gradeClassName||''}    ${' '+course.name}`"
            :img="course.imgUrl"
          >
            <template v-slot:right>
              <el-button
                type="warning"
                round
                @click.native="goRoom(course)"
              >进入直播教室</el-button>
            </template>
            <div class="card_message">
              <p>
                <span>讲课教师：{{course.teacherName}}</span>
                <span>开课时间：{{course.courseTime}}</span>
              </p>
              <p>
                上课人数：已到
                <i>{{course.comeCourseNum}}</i>人/应到
                <i>{{course.courseNum}}</i>人
              </p>
              <p>
                距离开课时间：
                <i>{{course.countDown}}</i>
              </p>
            </div>
          </course-box>

          <!-- <course-box
            v-for="course of 10"
            :key="course.id"
            :title="`${course.gradeClassName||''}    ${' '+course.name}`"
            :img="course.imgUrl"
          >
            <template v-slot:right>
              <el-button type="warning" round>进入直播教室</el-button>
            </template>
            <div class="card_message">
              <p>
                <span>讲课教师：{{323232132132}}</span>
                <span>开课时间：{{132323213213213}}</span>
              </p>
              <p>
                上课人数：已到
                <i>{{34}}</i>人/应到
                <i>{{60}}</i>人
              </p>
              <p>
                距离开课时间：
                <i>{{312323123232}}</i>
              </p>
            </div>
          </course-box>-->
        </div>
        <div v-else class="_tip">暂无课程</div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkTodayCourse } from "@/api/account/student";
import { roomUrl } from "@/utils/env";
import {getToken} from '@/utils/auth'
export default {
  data() {
    return {
      courseList: []
    };
  },
  components: {
    navBar: () => import("./Nav"),
    "course-box": () => import("../components/CourseBox.vue")
  },
  created() {
    this.initCourses();
  },
  methods: {
    initCourses() {
      checkTodayCourse().then(res => {
        if (res.code == 200) {
          this.courseList = res.rows;
        }
      });
    },
    toLive(time, entranceTime) {
      if (new Date(time).getTime() - Date.now() < entranceTime * 60 * 1000) {
        return true;
      } else {
        return false;
      }
    },
    goRoom(course) {
      let params = {
        token: getToken(),
        roomId: course.id + "",
        courseArrangeId: course.courseArrangeId + "",
        roleType: "2",
        status:'check',
        pathname:"/check"
      };

      params = window.btoa(JSON.stringify(params));
      window.open(roomUrl+'/devices-check' + `?params=` + params);
    }
  }
};
</script>

<style lang="scss">
#inspectionPage {
  .el-alert--info.is-light {
    background-color: #e7edf5;
    color: #17509d;
  }
}
</style>


<style lang="scss" scoped>
#inspectionPage {
  background-color: #f7f7f7;
  .container {
    padding: 30px 110px;
    margin-top: 10px;
    background-color: #fff;
    h3 {
      color: #020202;
      font-size: 16px;
      margin-top: 30px;
    }
    .course_lists {
      padding: 20px;
      ._list {
        display: flex;
        @media screen and (max-width: 1475px) {
          flex-wrap: wrap;
          justify-content: center;
        }
        & > div {
          margin: 20px;
          @media screen and (max-width: 900px) {
            width: 100%;
            margin: 10px;
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
        }
      }
    }
  }
}
</style>
