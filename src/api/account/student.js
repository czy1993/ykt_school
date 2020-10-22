import request from "@/utils/request";
import { baseUrl } from "@/utils/env.js";

// 查询学生账户列表
export function showMenu(query) {
  return request({
    url: "/system/student/showMenu",
    method: "get",
    params: query
  });
}

//删除学生
export function deleteOne(query) {
  return request({
    url: "/system/student/deleteOne",
    method: "get",
    params: query
  });
}

//重置密码
export function resetPassword(query) {
  return request({
    url: "/system/student/resetPassword",
    method: "get",
    params: query
  });
}

//新增学生
export function addOne(data) {
  return request({
    url: "/system/student/addOne",
    method: "post",
    data
  });
}

//查询所有年级
export function queryGrade() {
  return request({
    url: "/system/student/queryGrade",
    method: "get"
  });
}

//查询年级所含所有班级
export function queryClass(query) {
  return request({
    url: "/system/student/queryClass",
    method: "get",
    params: query
  });
}

//学生账户历史操作记录
export function updateHistory(query) {
  return request({
    url: "/system/student/updateHistory",
    method: "get",
    params: query
  });
}

//搜索学生账户历史操作记录
export function queryOneHistory(query) {
  return request({
    url: "/system/student/queryOneHistory",
    method: "get",
    params: query
  });
}

//批量修改班级
export function setGradeAndClass(query) {
  return request({
    url: "/system/student/setGradeAndClass",
    method: "get",
    params: query
  });
}

//导入学生信息
export const importUrl = "/system/student/importStudentData";

export const downloadUrl =
  baseUrl + "/system/common/download?delete=true&fileName=";

//账户管理,导出选中学生信息
export function exportStudentData(query) {
  return request({
    url: "/system/student/exportStudentData",
    method: "get",
    params: query
  });
}

//账户管理,按班级导出学生信息
export function exportByClass() {
  return request({
    url: "/system/student/exportByClass",
    method: "get"
  });
}

//学生今日到课异常统计
export function cntTodayStudent(data) {
  return request({
    url: "/system/statistic/cntTodayStudent",
    method: "post",
    data
  });
}

//获得该学校,年级/班级 级联集合
export function getGradeCascadeClassNo(params) {
  return request({
    url: "/system/statistic/getGradeCascadeClassNo",
    method: "get",
    params
  });
}

//根据年级/班级 查询该条件的所有学生,按学号排序
export function queryStudentByCondition(query) {
  return request({
    url: "/system/statistic/queryStudentByCondition",
    method: "get",
    params: query
  });
}

//查询具体 某个 年级/班级 下 某天的 课程
export function queryCourseByStudent(query) {
  return request({
    url: "/system/statistic/queryCourseByStudent",
    method: "get",
    params: query
  });
}

//列表添加巡检反馈信息
export function addErrorFeedBack(id, query) {
  return request({
    url: `/system/statistic/addErrorFeedBack/${id}`,
    method: "get",
    params: query
  });
}

//添加巡检异常记录
export function addErrorRecord(data) {
  return request({
    url: "/system/statistic/addErrorRecord",
    method: "post",
    data
  });
}

//添加请假记录
export function addLeaveRecord(data) {
  return request({
    url: "/system/statistic/addLeaveRecord",
    method: "post",
    data
  });
}

//学生到课明细接口
export function cntStudentDetail(query) {
  return request({
    url: `/system/statistic/cntStudentDetail`,
    method: "get",
    params: query
  });
}


//教师到课统计
export function cntTeacher(data) {
  return request({
    url: `/system/statistic/cntTeacher`,
    method: "post",
    data
  });
}

//一个月柱状图统计
export function oneMonthCourseMessage(query) {
  return request({
    url: `/system/statistic/oneMonthCourseMessage`,
    method: "get",
    params: query
  });
}

//下载Excel表格模板
export function downloadExcelUrl(query) {
  return request({
    url: `/system/student/downloadUrl`,
    method: "get",
    params: query
  });
}

// 巡检员查询课表
export function checkTodayCourse() {
  return request({
    url: "/front/student/checkTodayCourse",
    method: "get",
  });
}