<template>
  <div id="bulkReset">
    <p class="tip">确定重置吗？</p>
    <footer>
      <el-button @click.native="cancel" type="info" plain>取消</el-button>
      <el-button :loading="loading" @click.native="confirm" type="primary">确定</el-button>
    </footer>
  </div>
</template>

<script>
import { resetPassword } from "@/api/account/student";
export default {
  props: ["selected"],
  data(){
    return{
      loading:false
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      if (this.selected.length > 0) {
        this.loading=true;
        let arr = this.selected.reduce((acc, cur) => {
          acc.push(cur.id);
          return acc;
        }, []);
        resetPassword({
          studentIdStr: arr.toString()
        }).then(res => {
           this.loading=false;
          if (res.code == 200) {
            this.$message.success("重置密码成功！");
            this.$emit("success");
          } else {
            this.$message.error("重置密码失败！");
          }
        }).catch(err=>{
          this.loading=false;
        })
      }else{
        this.$message.error('请选择学生账户')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#bulkReset {
  .tip {
    text-align: center;
  }
  footer {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
