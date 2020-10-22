<template>
  <div id="modifyClass">
    <p>当前班级</p>
    <div class="top">
      <div>
        <span>年级：</span>
        <!-- <el-select multiple v-model="grade">
          <el-option :label="'一年级'" :value="'1'"></el-option>
        </el-select>-->
        <p>{{grade}}</p>
      </div>

      <div>
        <span>班号：</span>
        <p>{{classNumber}}</p>
      </div>
    </div>
    <p>修改为</p>
    <div class="bottom">
      <div>
        <span>年级：</span>
        <el-select @change="gradeChange" v-model="modifiedGrade">
          <el-option v-for="item of gradeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>

      <div>
        <span>班号：</span>
        <el-select v-model="modifiedClass">
          <el-option v-for="item of classList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
    </div>
    <footer>
      <el-button @click.native="cancel" type="info" plain>取消</el-button>
      <el-button @click.native="confirm" type="primary">确定</el-button>
    </footer>
  </div>
</template>

<script>
import { setGradeAndClass } from "@/api/account/student";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  props: ["selected", "visible"],
  data() {
    return {
      grade: "",
      classNumber: "",
      modifiedGrade: "",
      modifiedClass: "",
      studentIdStr:''
    };
  },
  computed: {
    ...mapState("student", ["gradeList", "classList"])
  },
  created(){
    this.initData()

  },
  methods: {
    ...mapActions("student", ["queryGrade", "queryClass"]),
     ...mapMutations("student", ["SAVE_CLASSS"]),
    initData() {
      this.grade = this.selected
        .reduce((acc, cur) => {
          acc.push(cur.grade);
          return acc;
        }, [])
        .toString();

      this.classNumber = this.selected
        .reduce((acc, cur) => {
          acc.push(cur.classNo);
          return acc;
        }, [])
        .toString();

        this.studentIdStr = this.selected
        .reduce((acc, cur) => {
          acc.push(cur.id);
          return acc;
        }, [])
        .toString();
      this.queryGrade();
    },
    gradeChange(val) {
      let grade = this.gradeList.find(item => {
        return item.name === val;
      });
      if (grade) {
        this.queryClass({
          gradeId: grade.id
        });
      } else {
        this.SAVE_CLASSS([]);
      }
    },
    confirm() {
      if(this.selected.length>0){
        if(!this.modifiedGrade||!this.modifiedClass){
         return void this.$message.error('请选择修改年级和修改班号')
        }
        setGradeAndClass({
          className:this.modifiedClass,
          gradeName:this.modifiedGrade,
          studentIdStr:this.studentIdStr
        }).then(res=>{
          if(res.code==200){
            void this.$message.success('修改成功');
            this.$emit('success')
          }
        })

      }else{
        void this.$message.error('请选择学生账户')
      }
    },
    cancel() {}
  },
  watch: {
    visible(val) {
      if (val) {
        this.initData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#modifyClass {
  .top,
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    & > div {
      flex-basis: 40%;
      display: flex;
      align-items: center;
      span {
        flex-shrink: 0;
        text-align: left;
        margin-right: 20px;
      }
    }
    &.top > div {
      align-items: flex-start;
      p {
        word-break: break-all;
      }
    }
  }
  footer {
    display: flex;
    justify-content: center;
  }
}
</style>
