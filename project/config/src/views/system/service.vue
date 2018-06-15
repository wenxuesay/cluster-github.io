<template lang="pug">
  .sf-panel
    .panel-body
      el-row(:gutter="40")
        el-col.left-col(:span="6")
          i.fa.fa-server
          | 服务类型配置
        el-col.right-col(:span="18")
          .btn-group
            button.btn-primary(@click="serviceShow") 新建服务类型
          SfTable(:tColumns="tColumns",:tData="tData")
            el-table-column(slot="actions",label="操作")
              template(slot-scope="scope")
                button.btn-default(@click='tEdit(scope.row,scope.$index)') 服务配置
                button.btn-red(@click='tDel(scope.row, scope.$index)') 删除
    el-dialog.sf-form.fix-75(:title="serviceForm.id ? '服务类型配置 ':'新建服务类型'",:visible.sync="serviceVisable",@close="resetFields('serviceForm')")
      el-form(:model="serviceForm",label-width="110px",:rules="formRules",ref="serviceForm")
        el-form-item(label="服务类型名称:",prop="type_name")
          el-input(v-model="serviceForm.type_name")
        div.sform-inline(v-for="(role,i) in serviceForm.roles",:key="i")
          el-form-item(label="角色名")
            el-input(v-model="role.name")
          el-form-item(label="进程名")
            el-input(v-model="role.proc_name")
          el-form-item(label="备注")
            el-input(v-model="role.remarks")
          i.fa.el-icon-remove-outline(@click="delRole(i)")
        .add-role(@click="addRole") 
          i.fa.el-icon-plus
          | 添加
          //- el-select(v-model="serviceForm.taskName")
          //-   el-option(v-for="option in hostGroups.options",:label="option.label",:key="option.value",:value="option.value")
      .dialog-footer(slot="footer")
        button.btn-default(@click="serviceVisable = false") 取消
        button.btn-primary(@click="saveService") 确定
</template>
<script>
import SfTable from '../../components/sfTable';

export default {
  components: {
    SfTable,
  },
  methods: {
    saveService() {
      if (this.serviceForm.roles.length === 0) {
        this.$message.warning('请填写角色');
        return;
      }
      let flag = false;
      this.serviceForm.roles.forEach((v) => {
        if (!v.name || !v.proc_name) flag = true;
      });
      if (flag) {
        this.$message.warning('请填写角色信息');
        return;
      }
      this.$refs.serviceForm.validate((vaild) => {
        if (vaild) {
          if (this.serviceForm.id) {
            this.$axios.put('/back/roles/modify', this.serviceForm).then((res) => {
              if (res.status === 'ok') {
                this.$message.success('操作成功');
                this.serviceVisable = false;
              }
            });
          } else {
            this.$axios.post('/back/type/add', this.serviceForm).then((res) => {
              if (res.status === 'ok') {
                this.$message.success('操作成功');
                this.serviceVisable = false;
              }
            });
          }
        }
      });
    },
    tEdit(row, index) {
      this.serviceVisable = true;
      this.serviceForm = row;
      this.serviceForm.type_name = row.name;
      this.serviceForm.index = index;
    },
    tDel(row, index) {
      this.$confirm('此操作将删除该服务, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.tData.splice(index, 1);
      }).catch(() => {
      });
    },
    getService() {
      this.$axios.get('/back/role/lists').then((res) => {
        if (res.status === 'ok') {
          this.tData = res.clusters;
        }
      });
    },
    addRole() {
      this.serviceForm.roles.push({
        id: '',
        name: '',
        proc_name: '',
        remarks: '',
      });
    },
    delRole(i) {
      this.serviceForm.roles.splice(i, 1);
    },
    serviceShow() {
      this.serviceVisable = true;
      this.serviceForm.type_name = '';
      this.serviceForm.roles = [];
      this.serviceForm.index = null;
      this.serviceForm.id = null;
    },
    resetFields(type) {
      this.$refs[type].resetFields();
    },
  },
  mounted() {
    this.getService();
  },
  data() {
    return {
      serviceVisable: false,
      serviceForm: {
        type_name: '',
        roles: [],
      },
      formRules: {
        type_name: [
            { required: true, message: '请填写', trigger: 'blur' },
        ],
      },
      tColumns: [
        // { prop: 'index', label: '序号' },
        { prop: 'name', label: '服务类型' },
        { prop: 'role_count', label: '角色数' },
        { prop: 'create_time', label: '创建时间' },
        { prop: 'update_time', label: '最后修改时间' },
      ],
      tData: [
      ],
    };
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
.el-dialog__wrapper.sf-form.fix-75 .el-dialog {
  width: 770px ;
}
.add-role {
  cursor: pointer;
  i.fa{
    padding: 0 10px;
  }
  border: 1px dashed $border-color;
  border-radius: $border-radius;
  text-align: center;
  padding: 3px 0;
  margin: 0 15px 0 110px;
}
.sform-inline{
  i.fa {
    margin-left: 18px;
  }
  i.el-icon-remove-outline{
    font-size: 20px;
    cursor: pointer;
  }
  .el-form-item:nth-child(3) {
    display: inline-block;
    .el-form-item__content .el-input{
      width: 150px;
    }
  }
  .el-form-item:nth-child(1),.el-form-item:nth-child(2) {
    display: inline-block;
    .el-form-item__content .el-input{
      width: 100px;
    }
  }
}
</style>
