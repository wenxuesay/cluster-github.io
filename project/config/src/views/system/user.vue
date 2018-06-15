<template lang="pug">
  .sf-panel
    .panel-body
      el-row(:gutter="40")
        el-col.left-col(:span="6")
          i.fa.fa-user-o
          | 用户列表
        el-col.right-col(:span="18")
          //- .btn-group
            button.btn-primary 添加用户
          SfTable(:tColumns="tColumns",:tData="tData")
            el-table-column(slot="actions",label="操作")
              template(slot-scope="scope")
                button.btn-default(@click='tEdit(scope.row, scope.$index)') 设置权限
                button.btn-default(@click='changeStatus(scope.row, scope.$index)',v-if='scope.row.status == "未激活"') 激活
                //- button.btn-red(@click='tDel(scope.row, scope.$index)') 删除
    el-dialog.sf-form.fix-75(title="权限设置",:visible.sync="userVisable",@close="resetFields('userForm')")
      el-form(:model="userForm",label-width="120px",:rules="formRules",ref="userForm")
        el-form-item(label="操作对象:")
          p.lh36 {{userForm.gonghao}}({{userForm.chinese_name}})
        el-form-item(label="角色分配:")
          el-radio-group(v-model="userForm.role",:max="1")
            el-radio(label="超级管理员") 超级管理员
            el-radio(label="管理员") 管理员
            el-radio(label="只读") 只读
          //- el-select(v-model="serviceForm.taskName")
          //-   el-option(v-for="option in hostGroups.options",:label="option.label",:key="option.value",:value="option.value")
      .dialog-footer(slot="footer")
        button.btn-default(@click="userVisable = false") 取消
        button.btn-primary(@click="saveUser") 确定
</template>
<script>
import SfTable from '../../components/sfTable';

export default {
  components: {
    SfTable,
  },
  methods: {
    saveUser() {
      console.log(this.userForm);
    },
    tEdit(row, index) {
      this.userVisable = true;
      this.userForm = row;
      this.userForm.index = index;
    },
    changeStatus(row, index) {
      this.$axios.put('/back/user/change/status', { id: this.userForm.id, confirmed: '1' }).then((res) => {
        if (res.status === 'ok') {
          this.$message.success('操作成功');
          this.userForm.status = '已激活';
          this.tData.splice(index, 1, this.userForm);
        }
      });
    },
    tDel(row, index) {
      this.$confirm('此操作将删除该用户, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        // console.log(row);
        this.tData.splice(index, 1);
        console.log(index);
      }).catch(() => {
      });
    },
    resetFields(from) {
      this.$refs[from].resetFields();
    },
    getUsers() {
      this.$axios.get('/back/users/list').then((res) => {
        if (res.status === 'ok') {
          this.tData = res.results.map((v) => {
            const obj = Object.assign({}, v);
            // const arr = [];
            // arr.push(obj.role);
            // obj.role = arr;
            obj.status = obj.status ? '已激活' : '未激活';
            return obj;
          });
        }
      });
    },
  },
  data() {
    return {
      userVisable: false,
      userForm: {
        name: '',
        role: '',
      },
      tColumns: [
        { prop: 'gonghao', label: '工号' },
        { prop: 'chinese_name', label: '姓名' },
        { prop: 'role', label: '角色' },
        { prop: 'status', label: '状态' },
      ],
      formRules: {
        taskName: [
            { required: true, message: '任务名称', trigger: 'blur' },
        ],
        time: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur' },
        ],
        updatedAt: [
            { type: 'array', required: true, message: '请选择日期', trigger: 'blur' },
        ],
        taskId: [
            { required: true, message: '任务ID', trigger: 'blur' },
        ],
        taskType: [
            { required: true, message: '任务类型', trigger: 'blur' },
        ],
        hSelected: [
          { required: true, message: '请选择主机组', trigger: 'blur' },
        ],
      },
      tData: [
        { id: 1, no: '01371059', userName: '古x', role: '超级管理员', 状态: 'OK' },
        { id: 2, no: '01371059', userName: '古x', role: '超级管理员', 状态: 'OK' },
        { id: 3, no: '01371059', userName: '古x', role: '超级管理员', 状态: 'OK' },
      ],
    };
  },

  mounted() {
    this.getUsers();
  },
};
</script>
<style lang="scss">
.right-col {
  padding-top: 15px;
  padding-right: 100px;
  border-left: 1px solid $border-color;
}
.left-col {
  i{
    font-size: 20px;
    padding:12px;
  }
}
.lh36{
  line-height: 36px;
}
</style>
