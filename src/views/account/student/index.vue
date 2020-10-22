<template>
  <div id="studentAccount">
    <!-- 弹框 -->
    <el-dialog width="500px" :title="title" :visible.sync="dialogVisible">
      <component
        :visible="dialogVisible"
        :selected="selected"
        @success="success"
        @cancel="dialogVisible=false"
        :is="currentComponent"
      ></component>
    </el-dialog>

    <header>
      <el-button
        :type="btn.type"
        v-hasPermi="[btn.id]"
        @click.native="btn.click"
        v-for="(btn,index) of btnList"
        :key="index"
        :disabled="selected.length<1&&(btn.label==='修改班级'||btn.label==='重置密码')"
      >{{btn.name}}</el-button>
    </header>
    <div class="input">
      <el-input @change="search" placeholder="请输入姓名 / 学号搜索" v-model="name">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="table">
      <el-table
        :data="studentList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="name" label="姓名"></el-table-column>
        <el-table-column align="center" prop="sexDict" label="性别">
          <template slot-scope="scope">
            <span>{{sexType[scope.row.sexDict]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="stuNo" label="学号"></el-table-column>
        <el-table-column align="center" prop="idcard" label="身份证号"></el-table-column>
        <el-table-column align="center" prop="grade" sortable="custom" label="年级"></el-table-column>
        <el-table-column align="center" prop="classNo" sortable="custom" label="班号"></el-table-column>
        <el-table-column align="center" prop="phone" label="家长联系方式"></el-table-column>
        <el-table-column
          v-if="userInfo.admin||permissions.includes('system:student:remove')||permissions.includes('system:student:resetPwd')"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-popconfirm @onConfirm="deleteStudent(scope.row.id)" title="确定删除该学员账号吗？">
              <span
                v-hasPermi="['system:student:remove']"
                slot="reference"
                class="text_btn"
              >删除</span>
            </el-popconfirm>

            <el-popconfirm @onConfirm="resetPassword(scope.row.id)" title="确定重置该账号密码吗？">
              <span
                 v-hasPermi="['system:student:resetPwd']"
                slot="reference"
                class="text_btn"
              >重置密码</span>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <footer>
        <span>共{{total}}项</span>
        <div class="ft_r">
          <span
            v-if="userInfo.admin||(permissions.includes('system:studentRecord:list')&&showHistory)"
            @click="toHistory"
            class="tip"
          >历史操作记录</span>
          <el-pagination
            @size-change="sizeChange"
            :page-sizes="[10,20,50]"
            :page-size="size"
            @current-change="pageSkip"
            background
            layout="sizes,prev, pager, next"
            :pager-count="5"
            :total="total"
          ></el-pagination>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { deleteOne, resetPassword, addOne } from "@/api/account/student";
import { haveChildMenu } from "@/utils";
export default {
  data() {
    return {
      name: "",
      total: 1,
      currentPage: 1,
      selected: [],
      sexType: {
        "0": "男",
        "1": "女",
        "2": "未知"
      },
      btnList: [
        {
          name: "新增学生",
          label: "新增学生",
          type: "primary",
          id: "system:student:add",
          click: () => {
            this.currentComponent = "addStudent";
            this.title = "新增学生";
            this.dialogVisible = true;
          }
        },
        {
          name: "批量导入",
          label: "批量导入",
          type: "info",
          id: "system:student:import",
          click: () => {
            this.currentComponent = "bulkImport";
            this.title = "批量导入";
            this.dialogVisible = true;
          }
        },
        {
          name: "批量导出",
          label: "批量导出",
          type: "warning",
          id: "system:student:export",
          click: () => {
            this.currentComponent = "bulkExport";
            this.title = "批量导出";
            this.dialogVisible = true;
          }
        },
        {
          name: "批量重置",
          label: "重置密码",
          type: "",
          id: "system:student:resetPwd",
          click: () => {
            this.currentComponent = "bulkReset";
            this.title = "批量重置";
            this.dialogVisible = true;
          }
        },
        {
          name: "修改班级",
          label: "修改班级",
          type: "success",
          id: "system:student:updateClass",
          click: () => {
            this.currentComponent = "modifyClass";
            this.title = "修改班级";
            this.dialogVisible = true;
          }
        }
      ],
      dialogVisible: false,
      title: "新增学生",
      currentComponent: "addStudent",
      showHistory: false,
      gradeSort: null,
      classNoSort: null,
      size: 10
    };
  },
  computed: {
    ...mapState("student", ["studentList"]),
    ...mapState({
      permissions: state => state.user.permissions,
      userInfo: state => state.user.userInfo
    }),
    menuList() {
      return this.$store.state.user.menuList;
    }
  },
  components: {
    addStudent: () => import("./components/AddStudent.vue"),
    bulkImport: () => import("./components/BulkImport.vue"),
    bulkExport: () => import("./components/BulkExport.vue"),
    bulkReset: () => import("./components/BulkReset.vue"),
    modifyClass: () => import("./components/ModifyClass.vue")
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions("student", ["showMenu"]),
    //初始化数据
    initData() {
      this.showHistory = this.haveChildMenu();
      this.query(this.currentPage, this.gradeSort, this.classNoSort, this.size);
    },
    haveChildMenu() {
      let arr = this.menuList.find(item => {
        return item.label === "账户管理";
      });
      if (arr.children && arr.children.length > 0) {
        let menu = arr.children.find(me => {
          return me.label === "历史操作记录";
        });
        if (menu) {
          return true;
        }
      } else {
        return false;
      }
    },

    query(page, ...rest) {
      this.showMenu({
        condition: this.name,
        pageNum: page,
        pageSize: rest[2],
        gradeSort: rest[0],
        classNoSort: rest[1]
      }).then(res => {
        this.total = res.total;
      });
    },
    search() {
      this.currentPage = 1;
      this.query(1, this.gradeSort, this.classNoSort, this.size);
    },
    //删除学生
    deleteStudent(id) {
      deleteOne({
        studentId: id
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功！");
          this.query(this.currentPage, this.gradeSort, this.classNoSort, this.size);
        } else {
          this.$message.error("删除失败！");
        }
      });
    },
    //重置密码
    resetPassword(id) {
      resetPassword({
        studentIdStr: id
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("重置密码成功！");
          this.query(this.currentPage, this.gradeSort, this.classNoSort, this.size);
        } else {
          this.$message.error("重置密码失败！");
        }
      });
    },
    //排序
    sortChange(e) {
      let type = {
        ascending: "1",
        descending: "2"
      };
      if (e.prop === "grade") {
        this.gradeSort = type[e.order];
        this.classNoSort = null;
        this.query(this.currentPage, type[e.order],null,this.size);
      }
      if (e.prop === "classNo") {
        this.classNoSort = type[e.order];
        this.gradeSort = null;
        this.query(this.currentPage, null, type[e.order],this.size);
      }
    },
    handleSelectionChange(e) {
      console.log(e);
      this.selected = e;
    },
    toHistory() {
      this.$router.push("/account/historyRecord");
    },
    //新增学生成功
    // addSuccess() {
    //   this.dialogVisible = false;
    //   this.initData();
    // },
    // resetSuccess() {
    //   this.dialogVisible = false;
    //   this.initData();
    // },
    success() {
      this.dialogVisible = false;
      this.initData();
    },
    pageSkip(page) {
      this.currentPage = page;
      this.query(page, this.gradeSort, this.classNoSort, this.size);
    },
    sizeChange(size) {
      this.currentPage = 1;
      this.size = size;
      this.query(1, this.gradeSort, this.classNoSort, size);
    }
  },
  watch: {
    dialogVisible() {}
  }
};
</script>

<style lang="scss" scoped>
#studentAccount {
  padding: 30px 37px;
  font-size: 14px;
  header {
    margin-bottom: 20px;
  }
  .input {
    width: 400px;
    margin-bottom: 20px;
  }
  .table {
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .tip {
        color: #61acf1;
        cursor: pointer;
      }
      .ft_r {
        display: flex;
        align-items: center;
      }
    }
    .text_btn {
      color: #61acf1;
      cursor: pointer;
      margin: 0 5px;
    }
  }
}
</style>
