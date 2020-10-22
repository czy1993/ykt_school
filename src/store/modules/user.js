import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { roleMenuTreeselect } from "@/api/system/menu";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    permissions: [],
    userInfo: '',
    menuList: [],

    Grade:[],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_MENULIST(state, menuList) {
      state.menuList = menuList;
    },
    SET_Grade:(state,data) => {
      state.Grade = data
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      const schoolId = userInfo.schoolId;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid, schoolId)
          .then(res => {
            setToken(res.token);
            commit("SET_TOKEN", res.token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(res => {
            const user = res.user;
            // const avatar = user.avatar == "" ? require("@/assets/image/tou.png") : process.env.VUE_APP_BASE_API + user.avatar;
            const avatar =
              user.avatar == ""
                ? require("@/assets/image/tou.png")
                : user.avatar;
            if (res.permissions && res.permissions.length > 0) {
              // 验证返回的permissions是否是一个非空数组
              commit("SET_PERMISSIONS", res.permissions);
            }
            commit("SET_NAME", user.userName);
            commit("SET_AVATAR", avatar);
            commit("SET_USERINFO", user);

            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_PERMISSIONS", []);
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    },
    //获取菜单
    roleMenuTreeselect({ commit }, data) {
      return new Promise(resolve => {
        roleMenuTreeselect(data).then(res => {
          if (res.code == 200) {
           
            commit("SET_MENULIST", res.menus);
          }

          resolve();
        });
      });
    }
  }
};

export default user;
