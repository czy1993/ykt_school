<template>
  <div id="bulkImport">
    <p>
      请下载
      <a download="学生账户表格.xlsx" :href="downloadUrl">学生账户表格</a> ，填写完毕后上传
    </p>
    <p>请勿修改表头信息，否则将导致上传失败</p>
    <footer>
      <el-button @click.native="cancel" type="info" plain>取消</el-button>

      <el-upload
        class="upload-demo"
        :action="url"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :before-upload="handlePreview"
        :before-remove="beforeRemove"
        :limit="3"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :headers="upLoadheader"
        :with-credentials="true"
      >
        <el-button type="primary">选择文件</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </footer>
  </div>
</template>

<script>
import { importUrl, downloadExcelUrl } from "@/api/account/student";
import { getToken } from "@/utils/auth";
export default {
  props: ["visible"],
  data() {
    return {
      fileList: [],
      url: importUrl,
      upLoadheader: { Authorization: getToken() },
      downloadUrl: ""
    };
  },
  created() {
    this.initdownloadUrl();
  },
  methods: {
    initdownloadUrl() {
      downloadExcelUrl({
        type: "1"
      }).then(res => {
        if (res.code == 200) {
          this.downloadUrl = res.msg;
        } else {
          this.$message.error("暂无学生表格可供下载");
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    handleExceed() {},
    beforeRemove() {},
    handlePreview(e) {
      // console.log(e);
    },
    uploadSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.$message.success("导入成功！");
      } else {
        fileList.pop();
        this.$message.error(res.msg);
      }
    },
    uploadError(err) {
      this.$message.error(err);
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.fileList = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#bulkImport {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  p,
  footer {
    text-align: center;
    margin: 10px 0;
    a {
      color: #3a9def;
      cursor: pointer;
      font-style: normal;
    }
  }
  footer {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    button {
      margin: 0 10px;
    }
  }
}
</style>
