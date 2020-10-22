<template>
  <div class="app-container school-gl">
    <div class="school-head">学校管理</div>
    <div class="school-contart">
      <div class="from-view">
        <el-button class="addbut" type="primary" @click="showDialod('add')">新增学校</el-button>
        <el-input placeholder="请输入账号/校名搜索" v-model="condition" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="get_schoolMenu"></el-button>
        </el-input>
      </div>
      <el-table class="table-view" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="账号" width="180"></el-table-column>
        <el-table-column prop="name" label="校名" width="180"></el-table-column>
        <el-table-column prop="contactsM" label="联系人" width="180"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width="180"></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="open(scope.row,'delete')">删除</el-button>
            <el-button type="text" icon="el-icon-edit" @click="showDialod('edit',scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 新增学校 -->
    <el-dialog
      v-bind="$attrs"
      :visible.sync="dialogVisible"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      :title="title"
      width="50%"
    >
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="120px">
          <el-col :span="22">
            <el-form-item label="学校名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入校名"
                show-word-limit
                clearable
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系人" prop="contactsM">
              <el-input
                v-model="formData.contactsM"
                placeholder="请输入联系人"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入联系方式"
                :maxlength="11"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="存储空间" prop="bucket">
              <el-input
                v-model="formData.bucket"
                placeholder="请输入存储空间"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="netlessAk" prop="netlessAk">
              <el-input
                v-model="formData.netlessAk"
                placeholder="请输入netlessAk"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="APPID" prop="appid">
              <el-input
                v-model="formData.appid"
                placeholder="请输入APPID"
                show-word-limit
                clearable
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="APPKEY" prop="appkey">
              <el-input
                v-model="formData.appkey"
                placeholder="请输入APPKEY"
                show-word-limit
                clearable
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="netlessSk" prop="netlessSk">
              <el-input
                v-model="formData.netlessSk"
                placeholder="请输入netlessSk"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="白板" prop="netlessAppIdentifier">
              <el-input
                v-model="formData.netlessAppIdentifier"
                placeholder="请输入白板"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="netlessToken" prop="netlessToken">
              <el-input
                v-model="formData.netlessToken"
                placeholder="请输入netlessToken"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="ucloud region" prop="region">
              <el-input
                v-model="formData.region"
                placeholder="请输入ucloud region"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="融云AppKey" prop="rongAk">
              <el-input
                v-model="formData.rongAk"
                placeholder="请输入融云App Key"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="融云AppSecret" prop="rongAs">
              <el-input
                v-model="formData.rongAs"
                placeholder="请输入融云App Secret"
                show-word-limit
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
          <el-col :span="24">
            <el-form-item label="学校logo" prop="logoUrl">
              <input class="filss" ref="filss" type="file" @change="getFile" />
              <div class="upload-view">
                <el-image
                  v-if="host!=''"
                  class="logoUrl"
                  style="width: 100px; height: 100px"
                  :src="host+formData.logoUrl"
                  :preview-src-list="[host+formData.logoUrl]"
                ></el-image>
                <!-- <img class="logoUrl" v-if="host!=''" :src="host+formData.logoUrl" alt /> -->
                <img   @click="shangchaun" src="@/assets/image/shan.png" alt />
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { schoolMenu, deleteOne, addOne,updateOne} from "@/api/backstage.js";
import { uploadSingle } from "@/api/index.js";
export default {
  data() {
    return {
      condition: "",
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,

      dialogImageUrl: "",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      imgUrl: "@/assets/image/shan.png",
      dialogVisible1: false,
      host: "",
      title:"新增学校",
      formData: {
        appid: "",
        appkey: "",
        name: "",
        contactsM: "",
        phone: "",
        bucket: "",
        netlessAk: "",
        netlessAppIdentifier: "",
        netlessSk: "",
        netlessToken: "",
        region: "",
        rongAk: "",
        rongAs: "",
        logoUrl: "",
      },
      rules: {
        appid: [
          {
            required: true,
            message: "请输入APPID",
            trigger: "blur",
          },
        ],
        appkey: [
          {
            required: true,
            message: "请输入appkey",
            trigger: "blur",
          },
        ],
        bucket: [
          {
            required: true,
            message: "请输入存储空间",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入校名",
            trigger: "blur",
          },
        ],
        contactsM: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: "blur",
          },
        ],
        netlessAk: [
          {
            required: true,
            message: "请输入netlessAk",
            trigger: "blur",
          },
        ],
        netlessSk: [
          {
            required: true,
            message: "请输入netlessSk",
            trigger: "blur",
          },
        ],
        netlessAppIdentifier: [
          {
            required: true,
            message: "请输入netlessAppIdentifier",
            trigger: "blur",
          },
        ],
        netlessToken: [
          {
            required: true,
            message: "请输入netlessToken",
            trigger: "blur",
          },
        ],
        region: [
          {
            required: true,
            message: "请输入ucloud region",
            trigger: "blur",
          },
        ],
        rongAk: [
          {
            required: true,
            message: "请输入融云App Key",
            trigger: "blur",
          },
        ],
        rongAs: [
          {
            required: true,
            message: "请输入融云App Secret",
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "请上传学校logo",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.get_schoolMenu();
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.formData.logoUrl = file.url;
      this.dialogVisible1 = true;
    },
    shangchaun() {
      this.$refs.filss.dispatchEvent(new MouseEvent("click"));
    },
    showDialod(name,data){
      this.title = name=='add'?'新增学校':'编辑';
      if(name=='edit'){
        this.formData = data;
      }
      this.dialogVisible = true;
    },
    getFile() {
      let that = this;
      const inputFile = this.$refs.filss.files[0];
      let imgInfo;
      if (inputFile) {
        if (
          inputFile.type !== "image/jpeg" &&
          inputFile.type !== "image/png" &&
          inputFile.type !== "image/gif"
        ) {
          alert("不是有效的图片文件！");
          return;
        }
        let formData = new FormData();
        formData.append("file", inputFile);
        uploadSingle("img", formData).then((res) => {
          if (res.code == 200) {
            this.host = res.data.host;
            this.formData.logoUrl = res.data.url;
            this.$message({
              message: "上传成功!",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        return;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.get_schoolMenu();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.get_schoolMenu();
    },
    get_schoolMenu() {
      let data = `pageNum=${this.pageNum}&pageSize=${this.pageSize}&condition=${this.condition}`;
      schoolMenu(data).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    open(row, name) {
      let text =
        name == "delete"
          ? "‘‘" + row.name + "’’" + "刪除"
          : "‘‘" + row.name + "’’" + "学校的密码重置";
      this.$confirm(`此操作会将${text}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (name == "delete") {
            this.delete_One(row.id);
          } else {
          }
        })
        .catch(() => {});
    },
    //删除学校
    delete_One(id) {
      deleteOne(`schoolId=${id}`).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "已删除",
            type: "success",
            onClose: () => {
              this.get_schoolMenu();
            },
          });
        }
      });
    },
    // 新增学校
    add_One() {
      addOne(this.formData).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "学校新增成功",
            type: "success",
            onClose: () => {
              this.onClose();
              this.get_schoolMenu();
            },
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 编辑学校
    update_One(){
      updateOne(this.formData).then( res => {
        if (res.code == 200) {
          this.$message({
            message: "编辑成功",
            type: "success",
            onClose: () => {
              this.onClose();
              this.get_schoolMenu();
            },
          });
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    onOpen() {},
    onClose() {
      this.dialogVisible = false;
      Object.keys(this.formData).forEach( key => {
        this.formData[key] = '';
      })
      console.log(this.formData)
    },
    close() {
      this.$emit("update:visible", false);
      this.dialogVisible = false;
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        if(this.title == '新增学校'){
          this.add_One();
        }else{
          this.update_One()
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.school-gl {
  .school-head {
    height: 50px;
    font-size: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eceef1;
    border-top: 1px solid #eceef1;
    box-shadow: 0px 1px 3px 0px #eceef1;
    padding-left: 10px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .school-contart {
    .from-view {
      display: flex;
      margin-bottom: 10px;
      .addbut {
        margin-right: 10px;
      }
      .input-with-select {
        width: 300px;
      }
    }
    .table-view {
      margin-bottom: 10px;
    }
  }
  .filss {
    display: none;
  }
  .upload-view {
    height: 100px;
    min-width: 100px;
    display: flex;
    align-items: center;
    // justify-content: center;
    // border: 1px solid #c0c4cc;
    border-radius: 3px;
    .logoUrl {
      height: 100px;
      width: 100px;
      border-radius: 3px;
      margin-right: 10px;
    }
  }
}
</style>
