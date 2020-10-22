<template>
  <div id="bulkExport">
    <el-button :disabled="selected.length<1" :loading="exportSelectedLoading" @click.native="exportSelected" type="primary">导出当前选择学生账户明细</el-button>
    <el-button  :loading="exportClassLoading" @click.native="exportClass" type="primary" >按班级导出学生账户明细</el-button>
    <div class="downList">
      <a v-for="file of fileList" :key="file" ref="download" :href="file">{{ file | GetChinese}}表格下载</a>
    </div>
  </div>
</template>

<script>
import {
  exportStudentData,
  downloadUrl,
  exportByClass
} from "@/api/account/student";
import { export_json_to_excel } from "@/utils/Export2Excel";
export default {
  props: ["selected"],
  data() {
    return {
      exportSelectedLoading:false,
      exportClassLoading:false,
      downloadUrl: downloadUrl,
      fileList: []
    };
  },
  filters: {
    GetChinese(strValue) {
      if (strValue != null && strValue != "") {
        var reg = /[\u4e00-\u9fa5]/g;
        return strValue.match(reg).join("");
      } else return "";
    }
  },
  methods: {
    exportSelected() {
      this.fileList = [];
      
      if (this.selected.length > 0) {
        // this.handleExportExcel();
        this.exportSelectedLoading=true;
        let studentIdStr = this.selected
          .reduce((acc, cur) => {
            acc.push(cur.id);
            return acc;
          }, [])
          .toString();
        exportStudentData({
          studentIdStr
        }).then(res => {
          if (res.code == 200) {
            this.exportSelectedLoading=false;
            this.fileList.push(this.downloadUrl + res.msg);
          }
        });
      } else {
        this.$message.error("请选择学生账户");
      }
    },
    exportClass() {
      this.fileList = [];
      this.exportClassLoading=true;
      exportByClass().then(res => {
        if (res.code == 200) {
          this.fileList = res.data.map(url => {
            return this.downloadUrl + url;
          });
           this.exportClassLoading=false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#bulkExport {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    margin: 10px 0;
  }
  .downList {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    a {
      text-decoration: underline;
      color: blue;
      margin: 5px;
    }
  }
}
</style>
