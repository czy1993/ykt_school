<template>
  <div class="addParent">
    <div class="_container">
      <span>{{types[this.type]}}</span>
      <el-input :maxlength="type=='1'?15:30" show-word-limit v-model="feedBack" type="textarea"></el-input>
    </div>
    <footer>
      <el-button @click.native="cancel" type="info" plain>取消</el-button>
      <el-button @click.native="confirm" type="primary">确定</el-button>
    </footer>
  </div>
</template>

<script>
import { addErrorFeedBack } from "@/api/account/student";
export default {
  props: ["type", "id"],
  data() {
    return {
      feedBack: "",
      types: {
        "1": "告知家长方式",
        "2": "家长回应"
      }
    };
  },
  methods: {
    confirm() {
      if (!this.feedBack) {
        return void this.$message.error("请输入内容");
      }

      addErrorFeedBack(this.id, {
        noticeParentWay: this.type == "1" ? this.feedBack : null,
        parentFeedback: this.type == "2" ? this.feedBack : null
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$emit("success");
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="scss" scoped>
.addParent {
  ._container {
    display: flex;
    span {
      flex-shrink: 0;
      margin-right: 10px;
    }
  }
  footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
