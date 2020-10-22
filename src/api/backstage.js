/* 总后台用量管理、学校管理接口  */ 
import request from "@/utils/request";
/* 学校管理*/ 
// 查询所有学校 
export function schoolMenu(data){
    return request({
        url:"/system/school/schoolMenu?"+data,
        method:"get"
    })
}
//  删除学校  
export function deleteOne(data){
    return request({
        url:"/system/school/deleteOne?"+data,
        method:"get"
    })
}
// 新增学校 
export function addOne(data){
    return request({
        url:"/system/school/addOne",
        method:"post",
        data
    })
}
// 修改学校信息 /system/school/updateOne
export function updateOne(data){
    return request({
        url:"/system/school/updateOne",
        method:"post",
        data
    })
}
/* 用量管理 */

// 用量管理   
export function useTotal(data){
    return request({
        url:"/system/school/useTotal?"+data,
        method:'get'
    })
}
// 用量明细 
export function queryUseDetail(data){
    return request({
        url:"/system/school/queryUseDetail?"+data,
        method:"get"
    })
}
// 用量配置记录明细  
export function queryUseUpdateDetail(data){
    return request({
        url:"/system/school/queryUseUpdateDetail?"+data,
        method:"get"
    })
}
// 修改额定/临时用量  
export function updateUseTotal(data){
    return request({
        url:"/system/school/updateUseTotal?"+data,
        method:"get"
    })
}
// 开放用量 
export function openFlow(data){
    return request({
        url:"/system/school/openFlow?"+data,
        method:"get"
    })
}
//首页(当前用量) 
export function homePage(data){
    return request({
        url:"/system/school/homePage?"+data,
        method:"get"
    })
}