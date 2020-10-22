import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid,schoolId) {
  const data = {
    username,
    password,
    code,
    uuid,
    schoolId
  }
  return request({
    url: '/system/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/system/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/system/captchaImage',
    method: 'get'
  })
}


//学生登录
export function stuLogin(data) {
  return request({
    url: "/front/student/stuLogin",
    method: "post",
    data
  });
}

// 巡检员登录
export function checkLogin(data,token) {
  return request({
    url: '/front/student/checkLogin',
    method: 'post',
    // headers: {'token':token},
    data
  })
}