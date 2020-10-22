import request from "@/utils/request";

// 查询所有年级
export function queryGrade() {
  return request({
    url: "/system/student/queryGrade",
    method: "get"
  });
}
// 查询年级所含的班级

export function queryClass(data) {
  return request({
    url: "/system/student/queryClass?gradeId=" + data,
    method: "get"
  });
}

export function queryvideo() {
  return request({
    url: '/system/school/week/video',
    method: "get"
  });
}
//单文件上传 
export function uploadSingle(name, data) {
  console.log(name, data)
  return request({
    url: "/system/common/uploadSingle/"+name,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data
  })
}