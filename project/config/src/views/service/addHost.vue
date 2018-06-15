<template lang="pug">
    .sf-panel
      .panel-body
        //- sfsFilter(:filters.sync="filters",@search="search")
        .btn-group
          button.btn-blue(@click="bind") 批量绑定
        .info
          span 已选择 
            .text {{tableSearch.selection.length}} 
            | 项
          span(@click="clearSelection") 清空
        sfTable(:tColumns='tColumns',:tData="tData",:tableSearch.sync="tableSearch",@search="search")
          //- el-table-column(slot="a",label='主机名')
            template(slot-scope="scope")
              router-link(:to="'/host/hosts/hostDetail/'+scope.row.id") {{scope.row.fqdn}}
          //- el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 删除
      el-dialog.sf-form(title="批量删除主机",:visible.sync="batchDelVisible",@close="comdel = ''")
        p 确定删除以下 {{distributionTableSearch.selection.length}}台 主机 ？
        sfTable(:tColumns='tColumns',:tData="delData")
        .dialog-footer(slot="footer")
          span *删除操作需输入大写字母DELETE：
          el-input.inline(v-model="comdel")
          button.btn-default(@click="batchDelVisible = false") 取消
          button.btn-primary(@click="deleteHost") 确定
      //- el-dialog.sf-form(title="分配主机组",:visible.sync="distributionVisible",@close="hostGroups.selected='';")
        el-form(:model="hostGroups",label-width="120px",:rules="formRules",ref="hostGroups")
          el-form-item(label="选择主机组:",prop="hSelected")
            el-select(v-model="hostGroups.selected")
              el-option(v-for="option in hostGroups.options",:label="option.label",:key="option.value",:value="option.value")
        sfTable(:tColumns='tColumns',:tData="distributionData",:tableSearch="distributionTableSearch")
        .dialog-footer(slot="footer")
          button.btn-default(@click="distributionVisible = false;comdel = ''") 取消
          button.btn-primary(@click="saveDistribution") 确定
      el-dialog.sf-form(title="绑定实例",:visible.sync="bindVisible")
        el-form(:model="hostGroups",label-width="120px",:rules="formRules",ref="hostGroups")
          el-form-item(label="选择服务:",prop="hSelected")
            el-select(v-model="hostGroups.selected")
              el-option(v-for="option in hostGroupsOptions",:label="option.label",:key="option.value",:value="option.value")
        sfTable(:tColumns='tColumns',:tData="bindtData")
        .dialog-footer(slot="footer")
          button.btn-default(@click="bindVisible = false") 取消
          button.btn-primary(@click="saveBind") 确定

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
      // 确认删除
      comdel: '',
      delData: [],
      tableSearch: util.tableSearch({ selection: [] }),
      // selection: [],
      // 主机组详情
      hostGroups: {
        selected: '',
      },
      hostGroupsOptions: [],
      filters: [
        { label: '主机名或IP:', key: 'keywords', placeholder: '请选择', type: 'input', value: '' },
        { label: '状态:',
          key: 'status',
          placeholder: '请选择',
          type: 'input',
          options: [
            { label: '健康', value: 'ok' },
            { label: '异常', value: 'failed' },
            { label: '未知', value: 'unknow' },
          ],
          value: '' },
        { label: '主机组:', key: 'groups', placeholder: '请选择', type: 'input', options: [{ label: '测试', value: 'test' }], value: '' },
        { label: '集群:', key: 'service', placeholder: '请选择', type: 'input', options: [{ label: '测试', value: 'test' }], value: '' },
      ],
      tColumns: [
          { prop: 'name', label: '进程名', sortable: 'custom' },
          { prop: 'username', label: '端口号', sortable: 'custom' },
          { prop: 'pid', label: '服务类型', sortable: 'custom' },
          { prop: 'role', label: '服务角色', sortable: 'custom' },
          { prop: 'host', label: '主机名', sortable: 'custom' },
          { prop: 'port', label: 'IP地址', sortable: 'custom' },
          { prop: 'cpu_uti', label: '主机所属分组', sortable: 'custom' },
          { prop: 'service', label: '所属服务', sortable: 'custom' },
          { prop: 'stat', label: '状态', sortable: 'custom' },
      ],
      tData: [
        { id: 1, run_user: 1, pid: 1, proc_name: 1 },
      ],
      tTableSearch: {
        selection: [],
      },
      bindtData: [
      ],
      bindColumns: [
        { prop: 'fqdn', label: '主机名' },
        { prop: 'fqdn_ip4', label: 'IP地址' },
        { prop: 'num_cpus', label: 'CPU' },
        { prop: 'mem_total', label: '内存' },
        { prop: 'disk', label: '磁盘' },
        { prop: 'groups', label: '所属分组' },
      ],
      bindTableSearch: {
        selection: [],
      },
      distributionData: [
        { id: 1, fqdn_ip4: '123' },
        { id: 2, fqdn_ip4: '123' },
      ],
      distributionTableSearch: {
        selection: [],
      },
      batchDelVisible: false,
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
      options: [
          { value: '001', label: '加急' },
      ],
    };
  },
  mounted() {
    this.getInstance();
    // this.getInstance(0, 'bindtData');

      // this.hostGroupsOptions = res.services.map((v) => {
      //   const obj = {};
      //   obj.label = v.name;
      //   obj.value = v.id;
      //   return obj;
      // });
    // });
  },
  methods: {
    deleteHost() {
      if (!/DELETE/.test(this.comdel)) {
        this.$message.error('请确定');
        return;
      }
      const ids = this.delData.map(v => v.id);
      console.log(ids);
    },
    bind() {
      if (this.tableSearch.selection.length === 0) {
        this.$message.warning('请选择实例');
        return;
      }
      // console.log('hello');
      this.hostGroups.selected = '';
      this.bindtData = [].concat(this.tableSearch.selection);
      this.bindVisible = true;
    },
    saveDistribution() {
      const ids = this.distributionTableSearch.selection.map(v => v.id);
      if (ids.length === 0) {
        this.$message.warning('请选择需要分配的主机');
        return;
      }
      if (!this.hostGroups.selected) {
        this.$message.warning('请选择主机组');
        return;
      }
      // console.log(ids);
      this.$axios.put('/back/bond/group', { ids, group_id: this.hostGroups.selected }).then((res) => {
        if (res.status === 'ok') {
          this.$message.success('操作成功');
          this.distributionVisible = false;
          this.tableSearch.selection = [];
        }
      });
    },
    celarSelection(key) {
      this[key].selection = [];
    },
    search() {
      // this.getInstance(0, 'tData');
    },
    saveBind() {
      if (!this.hostGroups.selected) {
        this.$message.warning('请选择服务');
        return;
      }
      const obj = {};

      obj.id = this.bindtData.map(v => v.id);
      obj.service_id = this.hostGroups.selected;
      obj.type = 1;
      console.log(this.bindtData, obj, 111);
      this.$axios.put('/back/instances', obj).then((res) => {
        console.log(res);
        if (res.status === 'ok') {
          this.$message.success('操作成功');
          this.bindVisible = false;
          this.getInstance();
        }
      });
    },
    getInstance() {
      this.$axios.get('/back/instances').then((res) => {
        console.log(res, 111);
        if (res.rescode === 0) {
          this.tData = res.values;
        }
      });
      this.$axios.get('/back/services').then((res) => {
        if (res.rescode === 0) {
          res.values.map((v) => {
            this.hostGroupsOptions.push({
              label: v.name,
              value: v.id,
            });
          });
        }
      });
      // const $vm = this;
      // const obc = {};
      // // this.filters.forEach((v) => {
      // //   obc[v.key] = v.value;
      // // });
      // const formObj = Object.assign(obc, $vm.tableSearch);

      // Object.keys(formObj).forEach((k) => {
      //   if (!formObj[k]) delete formObj[k];
      // });
      // // formObj.isbound = isbound;
      // delete formObj.total;
      // this.$axios.get('/back/instance/list', { params: formObj }).then((res) => {
      //   this.tData = res.results;
      //   this.tableSearch.total = res.total;
      // }).catch(() => {
      // });
    },
    clearSelection() {
      this.tableSearch.selection = [];
    },
    batchCommand(command) {
      if (this.tableSearch.selection.length === 0) {
        this.$message.warning('请选择主机');
        return;
      }
      if (command === 'delete') {
        this.delData = this.tableSearch.selection;
        this.batchDelVisible = true;
      }
      if (command === 'distribution') {
        this.distributionData = this.tableSearch.selection;
        this.distributionTableSearch.selection = [];
        this.distributionVisible = true;
      }
    },
    bindCommand(command) {
      if (command === 'bind') {
        this.bindVisible = true;
      }
    },
    tDel(row, index) {
      this.$confirm('此操作将删除该主机, 是否继续?', '', {
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
    tEdit(row) {
      this.formVisible = true;
      this.form = Object.assign({}, row);
    },
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

</style>


