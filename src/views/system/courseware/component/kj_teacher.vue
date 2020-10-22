<template>
  <div class="kj">
    <h5>我的课件</h5>
    <div class="kj-from">
      <!-- v-hasPermi="['system:courseware:upload']" //显示-->
      <el-button
        type="primary"
        v-hasPermi="['system:myCourseware:upload']"
        @click="shangchuan"
        >课件上传</el-button
      >
      <el-button
        type="danger"
        :disabled="idStr == '' ? true : false"
        @click="operation('0')"
        >批量删除</el-button
      >
      <el-button
        type="warning"
        :disabled="idStr == '' ? true : false"
        plain
        @click="operation('1')"
        >批量锁定</el-button
      >
      <el-button
        type="primary"
        :disabled="idStr == '' ? true : false"
        plain
        @click="operation('2')"
        >批量解锁</el-button
      >
      <el-input
        placeholder="请输入教师名称/工号搜索"
        v-model="condition"
        class="el_input"
      >
        <el-button
          slot="append"
          @click="set_queryOne"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <input
        class="fileInput"
        v-show="false"
        ref="inputFile"
        type="file"
        @change="upload"
      />
    </div>
    <div class="kj-view">
      <div class="kj-li" v-for="(item, index) in kjData" :key="index">
        <img
          class="imgUrl"
          @click="kjDeep(index)"
          :src="require(`@/assets/kj_img/${item.imgUrl}.jpg`)"
          alt
        />
        <div class="text-view">
          <p>
            <span>{{ item.name }}</span>
            <!-- <img
              v-show="item.lockType == '1'"
              @click="set_resetPassword(item)"
              src="@/assets/icon/suo.png"
              alt
            /> -->
            <img @click="suo('2',item.id)" v-if="item.lockType=='1'" src="@/assets/icon/suo.png" alt />
            <img @click="suo('1',item.id)" v-else src="@/assets/icon/suo_.png" alt />
            
          </p>
         <p>{{item.userName}}  {{item.text}} ({{item.createBy}})</p>
        </div>
        <div :class="['status', item.status == true ? 'status-active' : '']">
          <img src="@/assets/icon/active.png" alt />
        </div>
        <div :class="['type', item.imgUrl]">{{ item.imgUrl }}</div>
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
    <!-- /***课件上传**/ -->
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :visible.sync="dialogVisible"
      @open="onOpen"
      @close="onClose"
      title="课件上传"
      width="30%"
    >
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <el-col :span="20">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入名称"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="类型" prop="type">
              <el-select
                v-model="formData.type"
                placeholder="请选择类型"
                clearable
                @change="typeChange"
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="上传" prop="url" required>
              <div class="file">
                <el-button size="small" type="primary">
                  {{ uploadText }}
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
                <input class="fileInput" type="file" @change="upload" />
                <div class="fileText" v-show="formData.url != null">
                  <span>{{ formData.url }}</span>
                  <i class="check el-icon-circle-check"></i>
                  <i class="close el-icon-circle-close"></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  myCourseWare,
  resetPassword,
  queryOne,
  myCourseWareUpload,
} from "@/api/teacher.js";
import { uploadSingle } from "@/api/index.js";
import { deepCopy } from "@/utils/index.js";
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      uploadText: "点击上传",
      kjData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      condition: "",
      url: [],
      idStr: "",
      type: "",
      dialogVisible: false,
      formData: {
        name: "",
        type: undefined,
        url: null,
      },
      simpleImage: "",
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
      },
      uploadImgUrl: "",
      urlAction:
        process.env.VUE_APP_BASE_API + "/system/common/uploadSingle/ppt",
      // urlAction: "http://192.168.0.169:8888/system/common/uploadSingle/img",
      urlfileList: [],
      folder: "",
      typeOptions: [
        {
          label: "WORD",
          text: "word",
          type: "temp",
          value: 0,
        },
        {
          label: "PPT",
          text: "ppt",
          type: "ppt",
          value: 1,
        },
        {
          label: "PDF",
          text: "pdf",
          type: "img",
          value: 2,
        },
        {
          label: "JPG",
          text: "jpg",
          type: "img",
          value: 3,
        },
        {
          label: "PNG",
          text: "png",
          type: "img",
          value: 4,
        },
      ],
    };
  },
  created() {
    this.get_myCourseWare();
  },
  methods: {
    get_myCourseWare() {
      let data = `pageNum=${this.pageNum}&pageSize=${this.pageSize}`;
      myCourseWare(data).then((res) => {
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
    },
    operation(i) {
      this.type = i;
      if (i != "2") {
        this.$confirm(
          `此操作将${i == "0" ? "删除" : "锁定"}选中课件, 是否继续?`,
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
    set_resetPassword(obj) {
      let data;
      let message;
      if (obj) {
        data = `idStr=${obj.id}&type=${obj.lockType == "1" ? "0" : "1"}`;
        message = obj.type == "1" ? "已锁定" : (obj.type=='0'?"已删除":'已解锁');
      } else {
        data = `idStr=${this.idStr}&type=${this.type}`;
        message = this.type == "1" ? "已批量锁定" :(this.type=='0'?'已批量删除':'已批量解锁');
      }
      resetPassword(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: message,
            onClose: () => {
              this.idStr = "";
              this.get_myCourseWare();
            },
          });
        }
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
          } else if (element.type == "3") {
            element.imgUrl = "jpg";
          } else {
            element.imgUrl = "png";
          }
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.get_myCourseWare();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.get_myCourseWare();
    },
    onOpen() {},
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    upload(e) {
      console.log(e);
      const input = e.target;
      const files = e.target.files;
      const loading = this.$loading({
        lock: true,
        text: "上传中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (files && files[0]) {
        const file = files[0];
        if (file.size > 1024 * 1024 * 100) {
          this.$message.error("文件不能超过100M");
          return false;
        } else {
          let formData = new FormData();
          formData.append("file", files[0]);
          myCourseWareUpload(formData)
            .then((res) => {
              if (res.code == 200) {
                loading.close();
                this.$message({
                  message: "上传成功!",
                  type: "success",
                  onClose: () => {
                    // this.uploadText = "已上传";
                    this.get_myCourseWare();
                    // this.formData.url = res.data.url;
                  },
                });
              } else {
                loading.close();
                this.$message.error(res.msg);
              }
            })
            .cath();
        }
      }
    },
    typeChange(val) {
      this.simpleImage = this.typeOptions[val].text;
      this.folder = this.typeOptions[val].type;
    },
    handelConfirm() {
      if (this.formData.name == "") {
        this.$message.error("请填写课件名称");
      } else if (this.simpleImage == "") {
        this.$message.error("请选择课件类型");
      } else if (this.formData.url == "") {
        this.$message.error("请上传课件");
      } else {
        this.get_myCourseWareUpload();
      }
    },
    get_myCourseWareUpload() {
      // let data = `name=${this.formData.name}&simpleImage=${this.simpleImage}&type=${this.formData.type}&url=${this.formData.url}`;
      myCourseWareUpload().then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "上传成功!",
            type: "success",
            onClose: () => {
              this.get_myCourseWare();
              this.uploadText = "点击上传";
              this.formData.url = "";
              this.dialogVisible = false;
            },
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    shangchuan() {
      this.$refs.inputFile.dispatchEvent(new MouseEvent("click"));
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./kj.scss";
.el-upload__tip {
  line-height: 1.2;
}
.file {
  position: relative;
  .fileInput {
    position: absolute;
    left: 0;
    top: 0;
    height: 30px;
    opacity: 0;
  }
}
.fileText {
  display: flex;
  align-items: center;
  color: #7bf094;
  i {
    margin-left: 10px;
    font-size: 16px;
  }
  .close {
    display: none;
    font-size: 18px;
    color: #ece020;
  }
  span {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    color: #555555;
  }
}
</style>

