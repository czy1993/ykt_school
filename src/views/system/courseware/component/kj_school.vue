<template>
  <div class="kj">
    <h5>本校课件</h5>
    <div class="kj-from">
      <el-button class="download" @click="download" :disabled="idStr==''?true:false">批量下载</el-button>
      <el-button type="danger" :disabled="idStr==''?true:false" @click="operation('0')">批量删除</el-button>
      <el-button type="warning" :disabled="idStr==''?true:false" plain @click="operation('1')">批量锁定</el-button>
      <el-button type="primary" :disabled="idStr==''?true:false" plain @click="operation('2')">批量解锁</el-button>
      <el-input placeholder="请输入教师名称/工号搜索" v-model="condition" class="el_input">
        <el-button slot="append" @click="set_queryOne" icon="el-icon-search"></el-button>
      </el-input>
      <a v-show="false" ref="kj_download" download="课件.ppt" :href="zipUrl">批量下载</a>
    </div>
    <div class="kj-view">
      <div class="kj-li" v-for="(item,index) in kjData" :key="index" >
        <img class="imgUrl" @click="kjDeep(index)" :src="require(`@/assets/kj_img/${item.imgUrl}.jpg`)" alt />
        <div class="text-view">
          <p>
            <span>{{item.name}}</span>
            <img @click="suo('2',item.id)" v-if="item.lockType=='1'" src="@/assets/icon/suo.png" alt />
            <img @click="suo('1',item.id)" v-else src="@/assets/icon/suo_.png" alt />
          </p>
          <p>{{item.userName}}  {{item.text}} ({{item.createBy}})</p>
        </div>
        <div :class="['status',item.status==true?'status-active':'']">
          <img src="@/assets/icon/active.png" alt />
        </div>
        <div :class="['type',item.imgUrl]">{{item.imgUrl}}</div>
      </div>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import {
  schoolCourseWare,
  resetPassword,
  queryOne,
  downloadUrl2,
} from "@/api/teacher.js";
import { deepCopy } from "@/utils/index.js";
export default {
  data() {
    return {
      kjData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      input3: "",
      url: [],
      idStr: "",
      type: "",
      condition: "",
      zipUrl: "",
      time: true,
    };
  },
  created() {
    this.get_schoolCourseWare();
  },
  methods: {
    get_schoolCourseWare() {
      let data = `pageNum=${this.pageNum}&pageSize=${this.pageSize}`;
      schoolCourseWare(data).then((res) => {
        this.resSave(res);
      });
    },
    kjDeep(index) {
      let data = deepCopy(this.kjData);
      let id = [];
      data[index].status = !data[index].status;
      data.forEach((element) => {
        if (element.status == true) {
          id.push(element.id);
        }
      });
      this.idStr = id.join(",");
      this.kjData = data;
      console.log(process);
      this.zipUrl = `http://192.168.0.169:8888/system/student/downloadWareUrl?courseWareId=${this.idStr}`;
    },
    operation(i) {
      this.type = i;
      if (i != "2") {
        this.$confirm(
          `此操作将${i == "0" ? " 删除 " : " 锁定 "}选中课件, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.set_resetPassword();
        });
      } else {
        this.set_resetPassword();
      }
    },
    set_resetPassword() {
      let data = `idStr=${this.idStr}&type=${this.type}`;
      resetPassword(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "成功!",
            onClose: () => {
              this.idStr = "";
              this.get_schoolCourseWare();
            },
          });
        }
      });
    },
    suo(type,id){
      this.idStr = id;
      this.type = type;
      this.$confirm(
          `此操作将${type == "2" ? "解锁" : " 锁定 "}选中课件, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.set_resetPassword();
        });
    },
    set_queryOne() {
      let data = `condition=${this.condition}&source=1&pageNum=${this.pageNum}&pageSize=${this.pageSize}`;
      queryOne(data).then((res) => {
        this.resSave(res);
      });
    },
    resSave(res) {
      if (res.code == 200) {
        this.kjData = res.rows;
        this.total = res.total;
        this.kjData.forEach((element) => {
          element.status = false;
          if (element.type == "0") {
            element.imgUrl = "word";
          } else if (element.type == "1") {
            element.imgUrl = "ppt";
          } else if (element.type == "2") {
            element.imgUrl = "pdf";
          } else {
            element.imgUrl = "jpg";
          }
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.get_schoolCourseWare();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.get_schoolCourseWare();
    },
    download() {
      let idARR;
      let downType = true;
      if (this.time == true) {
        if (this.idStr.search(",") == -1) {
          idARR = [this.idStr];
        } else {
          idARR = this.idStr.split(",");
        }
        this.kjData.forEach((element) => {
          idARR.forEach((item) => {
            if (element.id == item && element.lockType == "1") {
              downType = false;
              this.$message("锁定的课件不能下载，请先解锁！");
            }
          });
        });
        if (downType == true) {
          this.$refs.kj_download.click();
          this.time = false;
          setTimeout(() => {
            this.time = true;
          }, 5000);
        }
      }
    },
    downloadFile(fileurl, filename) {
      var a = document.createElement("a");
      a.download = filename;
      a.style.display = "none";
      var blob = new Blob(fileurl); // 字符内容转变成blob地址
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click(); // 触发点击
      document.body.removeChild(a); // 然后移除
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./kj.scss";
</style>