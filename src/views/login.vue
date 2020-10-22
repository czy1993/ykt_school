<template>
  <div class="login">
    <!-- <el-button class="inspection" type="primary" round>课程巡检</el-button> -->

    <el-popover @show="show" placement="bottom" title="课程巡检" width="400" trigger="click">
      <!-- <el-button slot="reference">click 激活</el-button> -->
      <el-button slot="reference" class="inspection" type="primary" round>课程巡检</el-button>
      <div>
        <el-form label-width="80px" ref="inspectionForm" :model="inspectionForm">
          <el-form-item
            prop="schoolID"
            label="学校ID"
            :rules="{
              required: true, message: '学校ID不能为空', trigger: 'blur'
            }"
          >
            <el-input
              v-model="inspectionForm.schoolID"
              auto-complete="off"
              placeholder="学校ID"
              @keyup.enter.native="handleInspectorLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="inspectionPassword"
            label="巡检密码"
            :rules="{
              required: true, message: '巡检密码不能为空', trigger: 'blur'
            }"
          >
            <el-input
              v-model="inspectionForm.inspectionPassword"
              type="password"
              auto-complete="off"
              placeholder="巡检密码"
              @keyup.enter.native="handleInspectorLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click.native="handleInspectorLogin" type="primary">查看学校课程</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-popover>

    <img class="logo" src="../assets/logo/logo.png" alt>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <!-- <h3 class="title">若依后台管理系统</h3> -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="schoolId">
        <el-input
          v-model="loginForm.schoolId"
          type="text"
          auto-complete="off"
          placeholder="学校ID"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item>-->
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>
    </div>-->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCodeImg, checkLogin, stuLogin } from "@/api/login";
import { getRouters } from "@/api/menu";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { setToken } from "@/utils/auth";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        schoolId: "",
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: ""
        // uuid: ""
      },
      inspectionForm: {
        inspectionPassword: "",
        schoolID: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
        // code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      menuList: state => state.user.menuList
    })
  },
  created() {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    // getCode() {
    //   getCodeImg().then(res => {
    //     this.codeUrl = "data:image/gif;base64," + res.img;
    //     // this.loginForm.uuid = res.uuid;
    //   });
    // },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      const schoolId = Cookies.get("schoolId");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        schoolId: schoolId === undefined ? this.loginForm.schoolId : schoolId
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30
            });
            Cookies.set("schoolId", this.loginForm.schoolId, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
            Cookies.remove("schoolId");
          }
          window.localStorage.setItem("schoolId", this.loginForm.schoolId);
          localStorage.setItem("inspector", "0");
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              getRouters().then(res => {
                if (this.loginForm.schoolId == 1) {
                  if (this.isMainHome(res.data)) {
                    return this.$router.push({ path: "/home" });
                  } else if (this.isHome(res.data)) {
                    return this.$router.push({ path: "/index" });
                  }
                } else {
                  if (this.isHome(res.data)) {
                    return this.$router.push({ path: "/index" });
                  }
                }
                this.$router.push({ path: "/default/home" });
              });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    //是否有首页权限
    isHome(menuList) {
      let menu = menuList.find(item => {
        return item.meta && item.meta.title === "首页";
      });
      return menu ? true : false;
    },
    //是否有主页权限
    isMainHome(menuList) {
      let menu = menuList.find(item => {
        return item.meta && item.meta.title === "主页";
      });
      return menu ? true : false;
    },
    //巡检员登录
    handleInspectorLogin() {
      this.$refs.inspectionForm.validate(valid2 => {
        if (valid2) {
          window.localStorage.setItem("schoolId", this.inspectionForm.schoolId);
          checkLogin({
            schoolId: this.inspectionForm.schoolID,
            password: this.inspectionForm.inspectionPassword
          }).then(res => {
            if (res.code == 200) {
              localStorage.setItem("inspector", "1");
              setToken(res.msg);
              this.$router.push("/inspection");
            }
          });
        }
      });
    },
    show() {
      this.$refs["inspectionForm"].resetFields();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.inspection {
  position: absolute;
  right: 60px;
  top: 30px;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding-top: 120px;
  height: 100%;
  background-image: url("../assets/image/login-background.png");
  background-size: cover;
  // position: relative;
}
.logo {
  // position: absolute;
  // top: 10%;
  // left: 50%;
  margin-top: -40px;
  margin-bottom: 45px;
}
.title {
  margin-top: -40px;
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.el-select .el-select--medium {
  width: 200px !important;
}
</style>

