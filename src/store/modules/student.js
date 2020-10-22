import {
  showMenu,
  queryGrade,
  queryClass,
  updateHistory,
  queryOneHistory,
  cntTodayStudent,
  queryStudentByCondition,
  getGradeCascadeClassNo,
  queryCourseByStudent,
  cntStudentDetail,
  oneMonthCourseMessage
} from "@/api/account/student";
import { today } from "@/utils";

export default {
  namespaced: true,
  state: {
    studentList: [],
    gradeList: [],
    classList: [],
    historyList: [],
    arriveAbnormal: [],
    studentList: [], //某班级下的所有学生
    gradeClassNo: [],
    courseList: [],
    arriveDetail: [],
    chartData: {
      openCourseCnts: [],
      courseStatusCnts: []
    }
  },

  getters: {
    teacherTodayArrive(state) {
      let data;

      data = state.chartData.openCourseCnts.find(item => {
        return item.tempDate === today(new Date()).split(" ")[0];
      });
      if (data) {
        return data;
      }
      return {};
    },
    studentTodayArrive(state) {
      let data;

      data = state.chartData.courseStatusCnts.find(item => {
        return item.tempDate === today(new Date()).split(" ")[0];
      });
      if (data) {
        return data;
      }
      return {};
    }
  },
  mutations: {
    SAVE_STUDENTS(state, list) {
      state.studentList = list;
    },
    SAVE_GRADES(state, list) {
      state.gradeList = list;
    },
    SAVE_CLASSS(state, list) {
      state.classList = list;
    },
    SAVE_HOSTORY(state, list) {
      state.historyList = list;
    },
    SAVE_ARRIVEABNORMAL(state, list) {
      state.arriveAbnormal = list;
    },
    SAVE_STUDENTLIST(state, list) {
      state.studentList = list;
    },
    SAVE_GRADECLASSNO(state, list) {
      state.gradeClassNo = list;
    },
    SAVE_COURSE(state, list) {
      state.courseList = list;
    },
    SAVE_ARRIVEDETAIL(state, list) {
      state.arriveDetail = list;
    },
    SAVE_CHARTDATA(state, data) {
      state.chartData = data;
    }
  },

  actions: {
    showMenu({ commit }, data) {
      return new Promise((resolve, reject) => {
        showMenu(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_STUDENTS", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryGrade({ commit }) {
      return new Promise((resolve, reject) => {
        queryGrade()
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_GRADES", res.data);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryClass({ commit }, data) {
      return new Promise((resolve, reject) => {
        queryClass(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_CLASSS", res.data);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updateHistory({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateHistory(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_HOSTORY", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryOneHistory({ commit }, data) {
      return new Promise((resolve, reject) => {
        queryOneHistory(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_HOSTORY", res.data);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    cntTodayStudent({ commit }, data) {
      return new Promise((resolve, reject) => {
        cntTodayStudent(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_ARRIVEABNORMAL", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryStudentByCondition({ commit }, data) {
      return new Promise((resolve, reject) => {
        queryStudentByCondition(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_STUDENTLIST", res.data);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getGradeCascadeClassNo({ commit },params) {
      return new Promise((resolve, reject) => {
        getGradeCascadeClassNo(params)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_GRADECLASSNO", res.data);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryCourseByStudent({ commit }, data) {
      return new Promise((resolve, reject) => {
        queryCourseByStudent(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_COURSE", res.data);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    cntStudentDetail({ commit }, data) {
      return new Promise((resolve, reject) => {
        cntStudentDetail(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_ARRIVEDETAIL", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    oneMonthCourseMessage({ commit }, data) {
      return new Promise((resolve, reject) => {
        oneMonthCourseMessage(data)
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_CHARTDATA", res.data);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
