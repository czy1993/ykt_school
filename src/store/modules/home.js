import {
  queryTeaTodayCourse,
  queryNextCourse,
  queryTeaListenCourse,
  queryTeaOwnClass,
  homePage
} from "@/api/home";

export default {
  namespaced: true,
  state: {
    todayCourses: [],
    nextCourses: [],
    listenCourses: [],
    myClasses: [],
    useLevel: {},
    schoolUseLevels:[]
  },
  getters: {
    currentCourses(state) {
      return state.todayCourses.reduce((acc, cur) => {
        if (cur.countDown === "上课中") {
          acc.push(cur);
        }

        return acc;
      }, []);
    }
  },

  mutations: {
    SAVE_TODAYCOURSE(state, list) {
      state.todayCourses = list;
    },
    SAVE_NEXTCOURSE(state, list) {
      state.nextCourses = list;
    },
    SAVE_LISTENCOURSES(state, list) {
      state.listenCourses = list;
    },
    SAVE_MYCLASSES(state, list) {
      state.myClasses = list;
    },
    SAVE_USELEVEL(state, data) {
      state.useLevel = data;
    },
    SAVE_SCHOOLUSELEVELS(state, list){
      state.schoolUseLevels = list;
    }
  },

  actions: {
    queryTeaTodayCourse({ commit }) {
      return new Promise((resolve, reject) => {
        queryTeaTodayCourse()
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_TODAYCOURSE", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryNextCourse({ commit }) {
      return new Promise((resolve, reject) => {
        queryNextCourse()
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_NEXTCOURSE", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryTeaListenCourse({ commit }) {
      return new Promise((resolve, reject) => {
        queryTeaListenCourse()
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_LISTENCOURSES", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryTeaOwnClass({ commit }) {
      return new Promise((resolve, reject) => {
        queryTeaOwnClass()
          .then(res => {
            if (res.code == 200) {
              commit("SAVE_MYCLASSES", res.rows);
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    homePage({ commit }, params) {
      return new Promise((resolve, reject) => {
        homePage(params)
          .then(res => {
            if (res.code == 200) {
              if(params.type==='1'){
                commit("SAVE_USELEVEL", res.data);
              }else if(params.type==='2'){
                commit('SAVE_SCHOOLUSELEVELS',res.data)
              }
             
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
