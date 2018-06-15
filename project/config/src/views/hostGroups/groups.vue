<template lang="pug">
    .sf-panel
      .panel-body
        sfsFilter(:filters.sync='filters',@search="search")
        .btn-group
          button.btn-blue(@click="groupsVisable = true") 新建主机组
        sfTable(:tColumns='tColumns',:tData="tData",:tableSearch.sync="tableSearch",@search="search")
          //-el-table-column(slot="a",label='主机组名称')
            template(slot-scope="scope")
              router-link(:to="'/host/groups/groupsDetail/'+scope.row.id") {{scope.row.name}}
               router-link(:to="{ path: '/host/groups/groupsDetail/'+scope.row.id, query: {plan: '详情' }}") {{scope.row.name}}
          el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)")
                router-link.mannage(:to="{ path: '/host/groups/groupsDetail/'+scope.row.id, query: {plan: '详情' }}") 管理主机组
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.index)") 移除主机
      //-el-dialog.sf-form(title="批量删除主机",:visible.sync="batchDelVisible",@close="resetFields('form')")
        p 确定删除以下 4台 主机 ？
        sfTable(:tColumns='tColumns',:tData="tData",@search="search")
        .dialog-footer(slot="footer")
          span *删除操作需输入大写字母DELETE：
          el-input.inline(v-model="comdel")
          button.btn-default(@click="batchDelVisible = false") 取消
          button.btn-primary(@click="saveForm") 确定
      el-dialog.sf-form(title="新建主机组",:visible.sync="groupsVisable",@close="resetFields('hostGroups')")
        el-form(:model="hostGroups",label-width="120px",:rules="formRules",ref="hostGroups")
          el-form-item(label="主机组名称:",prop="name")
            el-input(v-model='hostGroups.name')
            //-el-select(v-model="hostGroups.name",placeholder="请选择")
                el-option(v-for="item in options",:key="item.value",:label="item.label",:value="item.value")
          el-form-item.commenInline(label="类型:",prop="type")
            //-el-input(v-model='hostGroups.name')
            el-select(v-model="hostGroups.type",placeholder="请选择类型",@change="sfType")
                el-option(v-for="item in options",:key="item.value",:label="item.label",:value="item.value")
          el-form-item.commenInline(label="Ip:",prop="ip")
            el-input(v-model='hostGroups.ip',:disabled="disabled")
            //-el-select(v-model="hostGroups.name",placeholder="请选择")
                el-option(v-for="item in options",:key="item.value",:label="item.label",:value="item.value")
          el-form-item(label="备注:",prop="info")
            el-input(v-model='hostGroups.info',type="textarea")

        .dialog-footer(slot="footer")
          button.btn-default(@click="groupsVisable = false") 取消
          button.btn-primary(@click="createGroups") 确定
</template>
<script>
import moment from 'moment';
import sfTable from '../../components/sfTable';
import sfsFilter from '../../components/sfsFilter';
import util from '../../lib/util';

export default {
  components: {
    sfTable,
    sfsFilter,
  },
  data() {
    return {
      disabled: true,
      comdel: '',
      tableSearch: util.tableSearch({ selection: [] }),
      hostGroups: {},
      groupsVisable: false,
      filters: [
        { label: '主机组名称:', key: 'name', placeholder: '请输入', type: 'input', value: '' },
      ],
      tColumns: [
          { prop: 'name', label: '主机组名称' },
          { prop: 'hosts', label: '主机数' },
          { prop: 'info', label: '备注' },
      ],
      tData: [],
      batchDelVisible: false,
      // delVisible: false,
      bindVisible: false,
      distributionVisible: false,
      formVisible: false,
      form: {
        taskName: '',
        time: '',
        updatedAt: '',
        taskId: '',
        taskType: '',
      },
      formRules: {
        name: [
            { required: true, message: '请输入主机名', trigger: 'blur' },
        ],
        // ip: [
        //     { required: true, message: '请输入Ip', trigger: 'blur' },
        // ],
        type: [
            { required: true, message: '请输入类型', trigger: 'blur' },
        ],
      },
    //   options: [
    //       { value: '001', label: '加急' },
    //   ],
      options: [],
      value: '',
    };
  },
  mounted() {
    this.getGroups();
  },
  methods: {
      // 弹框选择类型
    SelectType() {

    },
    sfType() {
      if (this.hostGroups.type === '1') {
        this.disabled = true;
      } else if (this.hostGroups.type === '2') {
        this.disabled = false;
      }
    },
    search() {
      this.getGroups();
    },
    createGroups() {
      this.$refs.hostGroups.validate((vaild) => {
        if (vaild) {
        //   this.hostGroups.user_id = 1;
          this.$axios.post('/back/hostgroups', this.hostGroups).then((res) => {
            console.log(res, 11);
            if (res.rescode === 0) {
              this.$message.success('操作成功');
              this.groupsVisable = false;
              this.getGroups();
            }
          });
        }
      });
    },
    batchCommand(command) {
      if (command === 'delete') {
        this.batchDelVisible = true;
      }
      if (command === 'distribution') {
        this.distributionVisible = true;
      }
    },
    bindCommand(command) {
      if (command === 'bind') {
        this.bindVisible = true;
      }
    },
    tDel(row, index) {
      console.log(row, index);
    //   row.splice(index, 1);
      const post = row.id;
      console.log(post);
      this.$confirm('此操作将删除该主机, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete(`/back/hostgroups?id=${post}`).then((res) => {
          console.log(res);
          if (res.rescode === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getGroups();
          }
        });
      }).catch(() => {
      });
    },
    tEdit(row) {
      this.formVisible = true;
      this.form = Object.assign({}, row);
    },
    /* 重置为初始值并移除校验结果 */
    resetFields(type) {
      this.$refs[type].resetFields();
    },
    saveForm() {
        // this.form.updatedAt = new Date(this.form.updatedAt);
      console.log(this.form.updatedAt);
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          console.log(this.form);
          this.form.time = moment(this.form.time).format('YYYY-MM-DD');
          this.form.updatedAt = this.form.updatedAt.map(v => moment(v).format('YYYY-MM-DD'));
          console.log(JSON.stringify(this.form));
        }
      });
    },
    getGroups() {
        // 弹出框类型
      this.$axios.get('/back/hostgrouptypes').then((res) => {
        this.options = res;
      });
      // 查询加展示列表
      const formObj = {};
      formObj.name = this.filters[0].value;
      this.$axios.get('/back/hostgroups', { params: formObj }).then((res) => {
        if (res.rescode === 0) {
          this.tData = res.values;
        }
      });
    //   formObj.currentPage = this.tableSearch.currentPage;
    //   formObj.pageSize = this.tableSearch.pageSize;
    //   if (this.tableSearch.order) {
    //     formObj.order = this.tableSearch.order === 'descending' ? 'desc' : 'asc';
    //   }
    //   if (this.tableSearch.prop) {
    //     formObj.prop = this.tableSearch.prop;
    //   }
    //   this.$axios.get('/back/groups/list', { params: formObj }).then((res) => {
    //     if (res.status === 'ok') {
    //       this.tData = res.results;
    //       this.tableSearch.total = res.total;
    //     }
    //   }).catch(() => {
    //   });
    },
  },


};
</script>
<style lang="scss">
.el-dialog__wrapper.sf-form .el-dialog .inline.el-input {
  width: 120px;
}
.el-dropdown-link {
  cursor: pointer;
}
.sf-form .commenInline{
    display: inline-block;
}
.mannage{
    color: #fff !important;
}
.info {
  background: #E6F7FF;
  padding: 10px 0;
  margin-bottom: 18px;
  border: 1px solid #CFEEFD;
  span{
    padding: 20px 30px;
    .text {
      display: inline-block;
      padding: 0px 5px;
      color:#1890FF;
    }
  }
  span:last-child{
    color:#1890FF;
    cursor: pointer;
  }
}
</style>


