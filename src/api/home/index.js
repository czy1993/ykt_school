import request from "@/utils/request";

// 首页-查询今日课程
export function queryTeaTodayCourse() {
  return request({
    url: "/system/video/queryTeaTodayCourse",
    method: "get"
  });
}

// 首页-查询下一节课
export function queryNextCourse() {
  return request({
    url: "/system/video/queryNextCourse",
    method: "get"
  });
}

// 首页-开放今日巡检
export function courseCheckSet(data) {
  return request({
    url: "/system/video/courseCheckSet",
    method: "post",
    data
  });
}

// 首页-查询今日听课
export function queryTeaListenCourse() {
  return request({
    url: "/system/video/queryTeaListenCourse",
    method: "get",
  });
}

// 首页-查询我的班级
export function queryTeaOwnClass() {
  return request({
    url: "/system/video/queryTeaOwnClass",
    method: "get",
  });
}

//首页-直播设置入场和回放
export function courseVideoSet(data) {
  return request({
    url: "/system/video/courseVideoSet",
    method: "post",
    data
  });
}


//首页-查询缺课详情
export function queryAbsenteeism(courseArrangeId) {
  return request({
    url: `/system/video/queryAbsenteeism/${courseArrangeId}`,
    method: "get",
  });
}

//首页(当前用量)
export function homePage(params) {
  return request({
    url: `/system/school/homePage`,
    method: "get",
    params
  });
}