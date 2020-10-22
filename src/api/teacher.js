import request from '@/utils/request'


// 教务管理  添加课程
export function adminInsert(data){
    return request({
        url:"/system/school/admin/insert",
        method:"post",
        data
    })
}
// 教务管理-学校课表-日历 
export function timetable(data){
    return request({
        url:"/system/school/admin/timetable?"+data,
        method:"get"
    })
}
//教务管理-学校课表-课程信息 
export function timetableInfo(data){
    return request({
        url:"/system/school/admin/timetable/info?"+data,
        method:"get"
    })
}
//通过主键查询课程  
export function selectOne(data){
    return request({
        url:"/system/school/selectOne?id="+data,
        method:"get"
    })
}
// 教师账户管理列表  
export function showMenu(){
    return request({
        url:"/system/teacher/showMenu",
        method:"get"
    })
}
// 教务管理-学校课程-编辑 
export function course_Edit(data){
    return request({
        url:"/system/school/admin/course/edit",
        method:"post",
        data
    })
}
// 教务管理-调课管理 
export function courseList(){
    return request({
        url:"/system/school/admin/course/list",
        method:"get"
    })
}
// 教务管理-调课管理-审批 
export function courseApprove(data){
    return request({
        url:"/system/school/admin/course/approve?"+data,
        method:"get"
    })
}
// 教务管理-课表操作记录  
export function courseRecord(data){
    return request({
        url:"/system/school/admin/course/record?"+data,
        method:"get"
    })
}
//排课用量
export function courseFlow(){
    return request({
        url:"/system/school/courseFlow",
        method:"get"
    })
}
// <------------------- 教室课表-------------------------->
//教师课表 --日历
export function teacherTimetable(data){
    return request({
        url:"/system/school/teacher/timetable?date="+data,
        method:"get"
    })
}
//教师课表-课程列表  
export function timetableList(data){
    return request({
        url:"/system/school/teacher/timetable/list?date="+data,
        method:"get"
    })
}
//教师课表-调课管理 
export function teacherCourseList(data){
    return request({
        url:"/system/school/teacher/course/list?"+data,
        method:'get'
    })
}  
//教师课表-调课管理-详情   
export function teacherCourseDetail(data){
    return request({
        url:"/system/school/teacher/course/detail?id="+data,
        method:'get',
    })
}
//教师课表-调课管理-下架申请-选择课程  
export function teacherCourseQuery(data){
    return request({
        url:"/system/school/teacher/course/query?"+data,
        method:"get"
    })
}
//教师课表-调课管理-下架申请 
export function teacherCourseDown(data){
    return request({
        url:"/system/school/teacher/course/down",
        method:"post",
        data
    })
}
//教师课程-上架申请
export function teacherInsert(data){
    return request({
        url:"/system/school/teacher/insert",
        method:"post",
        data
    })
}

// 教师课程-本周录像
export function weekVideo(){
    return request({
        url:"/system/school/week/video",
        method:"get"
    })
}
// 教师管理-全部录像  
export function allVideo(data){
    return request({
        url:"/system/school/all/video?"+data,
        method:'get'
    })
}
//批量删除录像  
export function deleteVideo(data){
    return request({
        url:"/system/school/delete/video",
        method:'post',
        data
    })
}

// 、、、、、、、、、 课件管理、、、、、、、、、、、
// 课件管理-学校课件 
export function schoolCourseWare(data){
    return request({
        url:"/system/school/schoolCourseWare?"+data,
        method:"get"
    })
}
// 批量处理课件  
export function resetPassword(data){
    return request({
        url:"/system/school/resetPassword?"+data,
        method:"get"
    })
}

// 课件管理-我的课件
export function myCourseWare(){
    return request({
        url:"/system/school/myCourseWare",
        method:"get"
    })
}
// 课件管理-条件搜索
export function queryOne(data){
    return request({
        url:"/system/school/queryOne?"+data,
        method:"get"
    })
}
//课件管理-上传我的课件 
export function myCourseWareUpload(data){
    return request({
        url:"/system/school/myCourseWareUpload",
        method:"post",
        data
    })
}
// 课件下载  
export function downloadUrl2(data){
    return request({
        url:"/system/student/downloadWareUrl?"+data,
        method:'get'
    })
}




