<template>
    <div class="lower_apply">
        <div class="lower_apply-head">
            <h5>课程上架申请</h5>
            <!-- <el-button type="text" :disabled="upCount==0?false:true">{{upCount==0?'无':"下一条"}}</el-button> -->
            <span v-show="upCount>0">{{`1/${upCount}`}}</span>
        </div>
        <div class="lower_apply-content" v-if="upCount>0">
            <div>
                <img class="upper-logo" src="../../../../assets/image/pic_kcsjsq.png" alt="">
            </div>
            
            <div>
                <span>申请人</span>
                <p>{{upApply.applyName}}</p>
            </div>
            <div>
                <span>申请时间</span>
                <p>{{upApply.applyTime}}</p>
            </div>
            <div>
                <span>申请班级</span>
                <p>{{upApply.gradeClass}}</p>
            </div>
            <div>
                <span>课程名称</span>
                <p>{{upApply.name}}</p>
            </div>
            <div>
                <span>上课时间</span>
                <p>{{upApply.schoolTime}}</p>
            </div>
            <!-- <div>
                <span>下架范围</span>
                <p>{{upApply.downType}}</p>
            </div> -->
            <div>
                <span>申请理由</span>
                <p>{{upApply.applyReason}}</p>
            </div>
        </div>
        <div class="lower_apply-content" v-else>
            <div>
                <img class="no_kc" src="../../../../assets/image/zanwushuju.png" alt="">
            </div>
        </div>
        <div class="lower_apply-foot" v-show="upCount>0">
            <el-button round type="primary"   @click="save_courseApprove('3',upApply.id)" size="mini"  plain>同意并更新教务信息</el-button>
            <el-button round  size="mini"  @click="save_courseApprove('2',upApply.id)" >不同意</el-button>
        </div>
    </div>
</template>
<script>
import { courseApprove } from "@/api/teacher.js";
export default {
     props:{
        upApply:Object,
        upCount:Number
    },
    data(){
        return{
            curriculum:{
                applicant:"孔子",
                application_time:"2020-08-08 12:30:00",
                application_class:"八年级四班",
                curriculum_name:"国学",
                class_time:"2020.09.13 周日 14:00-14:40 每周重复于2020.11.20日结束",
                range:"本周课程",
                reason:"个人原因"
            },
            curriculumTotal:false
        }
    },
    methods: {
    save_courseApprove(auditStatus, id) {
      courseApprove(`auditStatus=${auditStatus}&id=${id}`).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "操作成功",
            type: "success",
            onClose:()=>{
                this.$parent.get_courseList();
            }
          });
          
        }
      });
    },
  },
}
</script>
<style lang="scss" >
@import 'apply.scss';
</style>