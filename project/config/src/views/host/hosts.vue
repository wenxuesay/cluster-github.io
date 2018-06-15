<template lang="pug">
    .sf-panel
      .panel-body
        sfsFilter(:filters.sync="filters",@search="search")
        .btn-group
          el-dropdown(@command="batchCommand")
            span.el-dropdown-link.btn-default 批量操作
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(command="delete") 批量删除主机
              el-dropdown-item(command="distribution") 分配主机组
          //- router-link.btn-blue(to="/host/hosts/addhost") 添加主机
          el-dropdown(@command="bindCommand",trigger="click")
            span.el-dropdown-link
              | 未绑定主机
              i.el-icon-arrow-down.el-icon--right
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(command="bind") 绑定主机
        .info
          span 已选择
            .text {{tableSearch.selection.length}}
            | 项
          span(@click="clearSelection") 清空
        sfTable(:tColumns='tColumnse',:tData="tData",:tableSearch.sync="tableSearch",@search="search")
          //-el-table-column(slot="a",label='主机名')
            template(slot-scope="scope")
              router-link(:to="'/host/hosts/hostDetail/'+scope.row.id") {{scope.row.fqdn}}
          el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 移除主机
      el-dialog.sf-form(title="批量删除主机",:visible.sync="batchDelVisible",@close="comdel = ''")
        p 确定删除以下 {{delData.length}}台 主机 ？
        sfTable(:tColumns='tColumnse',:tData="delData")
        .dialog-footer(slot="footer")
          span *删除操作需输入大写字母DELETE：
          el-input.inline(v-model="comdel")
          button.btn-default(@click="batchDelVisible = false") 取消
          button.btn-primary(@click="deleteHost") 确定
      el-dialog.sf-form(title="分配主机组",:visible.sync="distributionVisible",@close="hostGroups.selected='';")
        el-form(:model="hostGroups",label-width="120px",:rules="formRules",ref="hostGroups")
          el-form-item(label="选择主机组:",prop="hSelected")
            el-select(v-model="hostGroups.selected")
              el-option(v-for="option in hostGroups.options",:label="option.label",:key="option.value",:value="option.value")
        sfTable(:tColumns='tColumnse',:tData="distributionData",:tableSearch="distributionTableSearch")
        .dialog-footer(slot="footer")
          button.btn-default(@click="distributionVisible = false;comdel = ''") 取消
          button.btn-primary(@click="saveDistribution") 确定
      el-dialog.sf-form(title="绑定主机",:visible.sync="bindVisible",@close="bindTableSearch.selection = []")
        p 当前有 {{bindtData.length}}台 主机未绑定，选择主机条目点击确认，完成主机绑定。
        .info
          span 已选择
            .text {{bindTableSearch.selection.length}}
            | 项
          span(@click="celarSelection('bindTableSearch')") 清空
        sfTable(:tColumns='tColumnse',:tData="bindtData",:tableSearch="bindTableSearch")
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
        options: [{
          label: '离线',
          value: '离线',
        }],
      },
      filters: [
        { label: '主机名或IP:', key: 'keywords', placeholder: '请选择', type: 'input', value: '' },
        { label: '状态:',
          key: 'status',
          placeholder: '请选择',
          type: 'input',
          options: [
            { label: '健康', value: 'ok' },
            { label: '异常', value: 'failed' },
          ],
          value: '' },
        { label: '主机组:', key: 'group_id', placeholder: '请选择', type: 'input', options: [{ label: '测试', value: 'test' }], value: '' },
        { label: '集群:', key: 'service_id', placeholder: '请选择', type: 'input', options: [{ label: '测试', value: 'test' }], value: '' },
      ],
      tColumns: [
          // { prop: 'fqdn', label: '主机名', sortable: 'custom' },
          { prop: 'fqdn_ip4', label: 'IP地址' },
          // { prop: 'agent', label: 'Agent心跳' },
          { prop: 'num_cpus', label: 'CPU' },
          { prop: 'mem_total', label: '内存' },
          { prop: 'disk', label: '磁盘' },
          { prop: 'status', label: '状态' },
          { prop: 'groups', label: '所属分组' },
          { prop: 'service', label: '所属集群' },
      ],
      tColumnse: [
          { prop: 'name', label: '主机名' },
          { prop: 'ip', label: 'IP地址', sortable: 'custom' },
          // { prop: 'agent', label: 'Agent心跳' },
          { prop: 'cpu', label: 'CPU' },
          { prop: 'memory', label: '内存' },
          { prop: 'hd', label: '磁盘' },
          { prop: 'stat', label: '状态', sortable: 'custom' },
          { prop: 'groups', label: '所属分组' },
          { prop: 'service', label: '所属集群' },
      ],
      tData: [
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
    const $vm = this;
    $vm.inist();
    // if (/failed/.test(this.$route.fullPath)) {
    //   $vm.filters[1].value = 'failed';
    // }
    // if (/unbond/.test(this.$route.fullPath)) {
    //   $vm.bindVisible = true;
    // }
    // this.getHosts(1, 'tData');
    // this.getHosts(0, 'bindtData');
    // this.$axios.get('/back/groups/list?currentPage=1&pageSize=10000').then((res) => {
    //   this.hostGroups.options = res.results.map((v) => {
    //     const obj = {};
    //     obj.label = v.name;
    //     obj.value = v.id;
    //     return obj;
    //   });
    // });
    // this.$axios.get('/back/services/all').then((res) => {
    //   $vm.filters[3].options = res.services.map((v) => {
    //     const ob = {
    //       label: v.name,
    //       value: v.id,
    //     };
    //     return ob;
    //   });
    // });
    // this.$axios.get('/back/groups/list?currentPage=1&pageSize=10000').then((res) => {
    //   $vm.filters[2].options = res.results.map((v) => {
    //     const ob = {
    //       label: v.name,
    //       value: v.id,
    //     };
    //     return ob;
    //   });
    // });
  },
  methods: {
    inist() {
        // 列表
      this.$axios.get('/back/hosts').then((res) => {
        if (res.rescode === 0) {
          this.tData = res.values;
          // console.log(this.tData, this.tColumnse, 22233);
        }
      });
      // 下拉框
      this.$axios.get('/back/host_stats').then((res) => {
        console.log(res);
        this.filters[1].options = res.values;
      });
      this.$axios.get('/back/host_clusters').then((res) => {
        console.log(res);
        this.filters[3].options = res.values;
      });
      this.$axios.get('/back/host_services').then((res) => {
        this.filters[2].options = res.values;
        this.hostGroups.options = res.values;
      });
    },
    deleteHost() {
    //   if (!/DELETE/.test(this.comdel)) {
    //     this.$message.error('请确定');
    //     return;
    //   }
      const ids = this.delData.map(v => v.id);
      const hostgroup = this.delData.map(v => v.hostgroup);
      console.log(ids, 333);
      const obj = {
        id: ids,
        hostgroup_id: hostgroup,
      };
    //   console.log(ids, obj);
      this.$axios.delete('/back/hosts', { data: obj }).then((res) => {
        console.log(res);
        if (res.rescode === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.inist();
        }
      });
    },
    // 分配主机组
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
      const post = {
        id: ids,
        hostgroup_id: this.hostGroups.selected,
      };
      console.log(this.hostGroups.selected, 2223);
      // console.log(ids);
      this.$axios.post('/back/hosts', post).then((res) => {
        if (res.rescode === 0) {
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
    //   this.getHosts(1, 'tData');
      const formObj = {
        name: this.filters[0].value,
        stat: this.filters[1].value,
        hostgroup_id: this.filters[2].value,
        cluster_id: this.filters[3].value,
      };
      // console.log(formObj, 222);
      this.$axios.get('/back/hosts', { params: formObj }).then((res) => {
        if (res.rescode === 0) {
          this.tData = res.values;
        }
      });
    },
    // 绑定主机
    saveBind() {
      if (this.bindTableSearch.selection.length === 0) {
        this.$message.warning('请选择绑定的主机');
        return;
      }
      const ids = this.bindTableSearch.selection.map(v => v.id);
      const post = {
        id: ids,
        type: 1,
      };
      this.$axios.put('/back/hosts', post).then((res) => {
        if (res.rescode === 0) {
          this.$message.success('操作成功');
          this.bindVisible = false;
        }
      });
      console.log(ids);
    },
    getHosts(isbound, key) {
      const $vm = this;
      const obc = {};
      this.filters.forEach((v) => {
        obc[v.key] = v.value;
      });
      const formObj = Object.assign(obc, $vm.tableSearch);

      Object.keys(formObj).forEach((k) => {
        if (!formObj[k]) delete formObj[k];
      });
      if (formObj.order) {
        formObj.order = formObj.order === 'descending' ? 'desc' : 'asc';
      }
      formObj.isbound = isbound;
      delete formObj.selection;
      delete formObj.total;
      this.$axios.get('/back/hosts', { params: formObj }).then((res) => {
        this[key] = res.result.hosts;
        if (key === 'tData') {
          this.tableSearch.total = res.total;
        }
      }).catch(() => {
      });
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
      if (this.tableSearch.selection.length === 0) {
        this.$message.warning('请选择主机');
        return;
      }
      if (command === 'bind') {
        console.log(this.bindTableSearch, 5555);
        this.bindtData = this.tableSearch.selection;
        this.bindTableSearch.selection = [];
        this.bindVisible = true;
      }
    },
    tDel(row, index) {
    //   const post = row.id;
      console.log(row, index);
      const obj = {
        id: row.id,
        hostgroup_id: row.hostgroup,
      };
      this.$confirm('此操作将删除该主机, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // this.$axios.delete('/back/hosts?id=${post}?hostgroup=${row.hostgroup}').then((res) => {
        this.$axios.delete('/back/hosts', { data: obj }).then((res) => {
          console.log(res);
          if (res.rescode === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.inist();
          }
        });
        // this.tData.splice(index, 1);
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

  // watch: {
  //   tData() {
  //     this.tableSearch.total = this.tData.length;
  //   },
  // },
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


