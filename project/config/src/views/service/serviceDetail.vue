<template lang="pug">
  div
    .summary
      p.top
        i.fa.fa-home
        span 服务:{{serviceDetails.name}}
        //- span 
          button.btn-primary 启动集群
          button.btn-primary 停止集群
      p.bottom
        span 创建时间:{{serviceDetails.create_time}}
        span 创建人: {{serviceDetails.creator}}
      el-tabs(@tab-click="tabClick",v-model='activeTab')
        el-tab-pane(label="实例列表",name="service")
        el-tab-pane(label="实例分组",name="host")
    .sf-panel(v-show="activeTab == 'service'")
      .panel-body
        //- .btn-group
          button.btn-primary 添加服务
        .btn-group
          el-dropdown(@command="batchCommand")
            span.el-dropdown-link.btn-default 批量操作
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(command="delete") 批量移除实例
              //- el-dropdown-item(command="distribution") 分配主机组
        .info
          span 已选择 
            .text {{serviceSearch.selection.length}} 
            | 项
          span(@click="clearSelection") 清空
        sfTable(:tColumns='serviceColumns',:tData="serviceData",:tableSearch.sync="serviceSearch",@search="search")
          el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 移除实例
          //- el-table-column(slot="a",label='服务名称')
            template(slot-scope="scope")
              router-link(:to="'/service/'+scope.row.id") {{scope.row.name}}
    .sf-panel(v-show="activeTab == 'host'")
      .panel-body
        sfsFilter(:filters.sync='filters',@search="instantsearchs")
        .btn-group
          button.btn-blue(@click="groupsVisable = true") 新建实例组
        sfTable(:tColumns='instantColumns',:tData="instanttData",:tableSearch.sync="tableSearch",@search="instantsearch")
          //-el-table-column(slot="a",label='主机组名称')
            template(slot-scope="scope")
              router-link(:to="'/host/groups/groupsDetail/'+scope.row.id") {{scope.row.name}}
               router-link(:to="{ path: '/host/groups/groupsDetail/'+scope.row.id, query: {plan: '详情' }}") {{scope.row.name}}
          el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)")
                router-link.mannage(:to="'/cluster/service/serviceinstant/'+scope.row.name") 管理实例组
              button.btn-red.btn-tiny(@click="instanttDel(scope.row,scope.index)") 移除实例
          //- el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 删除
    el-dialog.sf-form(title="新建实例组",:visible.sync="groupsVisable",@close="resetFields('hostGroups')")
      el-form(:model="hostGroups",label-width="120px",:rules="formRules",ref="hostGroups")
        el-form-item(label="实例组名称:",prop="name")
          el-input(v-model='hostGroups.name')
        el-form-item(label="备注:",prop="info")
          el-input(v-model='hostGroups.info',type="textarea")
      .dialog-footer(slot="footer")
        button.btn-default(@click="groupsVisable = false") 取消
        button.btn-primary(@click="createGroups") 确定
    el-dialog.sf-form(title="批量移除实例",:visible.sync="batchDelVisible",@close="comdel = ''")
      p 确定删除以下 {{delData.length}}台 主机 ？
      sfTable(:tColumns='serviceColumns',:tData="delData")
      .dialog-footer(slot="footer")
        span *删除操作需输入大写字母DELETE：
        el-input.inline(v-model="comdel")
        button.btn-default(@click="batchDelVisible = false") 取消
        button.btn-primary(@click="deleteHost") 确定
    el-dialog.sf-form(title="分配主机组",:visible.sync="distributionVisible",@close="resetFields('hostGroups')")
      el-form(:model="hostGroups",label-width="120px",:rules="formRules",ref="hostGroups")
        el-form-item(label="选择主机组:",prop="hSelected")
          el-select(v-model="hostGroups.selected")
            el-option(v-for="option in hostGroups.options",:label="option.label",:key="option.value",:value="option.value")
      sfTable(:tColumns='tColumns',:tData="tData",type="selection",@search="search")
      .dialog-footer(slot="footer")
        button.btn-default(@click="distributionVisible = false;comdel = ''") 取消
        button.btn-primary(@click="saveForm") 确定
    el-dialog.sf-form(title="绑定主机",:visible.sync="bindVisible",@close="resetFields('hostGroups')")
      p 当前有 100台 主机未绑定，选择主机条目点击确认，完成主机绑定。
      .info
        span 已选择 
          .text 4 
          | 项
        span 清空
      sfTable(:tColumns='tColumns',:tData="tData",type="selection",@search="search")
      .dialog-footer(slot="footer")
        button.btn-default(@click="bindVisible = false") 取消
        button.btn-primary(@click="saveForm") 确定

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
      delData: [],
      // 确认删除
      serviceDetails: {
        name: '',
        create_time: '',
        creator: '',
      },
      groupsVisable: false,
      activeTab: 'service',
      comdel: '',
      tableSearch: util.tableSearch({ selection: [] }),
      serviceSearch: util.tableSearch({ selection: [] }),
      // serviceSearch: {
      //   selection: [],
      // },
      // selection: [],
      // 主机组详情
      hostGroups: {},
      filters: [
        { label: '主机名或IP:', key: 'appName', placeholder: '请选择', type: 'input', value: '' },
      ],
      tColumns: [
      ],
      tData: [
      ],
      serviceColumns: [
          { prop: 'role', label: '角色', sortable: 'custom' },
          { prop: 'host', label: '主机名', sortable: 'custom' },
          { prop: 'pid', label: 'IP', sortable: 'custom' },
          { prop: 'proc_name', label: '所属实例组', sortable: 'custom' },
          { prop: 'stat', label: '状态', sortable: 'custom' },
          // { prop: 'port', label: '', sortable: 'custom' },
          // { prop: 'cpu_uti', label: 'CPU利用率', sortable: 'custom' },
          // { prop: 'mem_uti', label: '内存利用率', sortable: 'custom' },
          // { prop: 'status', label: '状态', sortable: 'custom' },
      ],
      instantColumns: [
          { prop: 'name', label: '实例组名称' },
          { prop: 'info', label: '信息' },
          { prop: 'instances', label: '实例数' },
      ],
      instanttData: [],
      serviceData: [
      ],
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
          { required: true, message: '请输入实例名', trigger: 'blur' },
        ],
        info: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ],
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
  computed: {
    id() {
      return this.$route.params.id;
      // return 4;
    },
  },
  mounted() {
    // this.getService();
    this.getInstance();
    this.getHosts();
    // this.$axios.get('/back/groups/list?currentPage=1&pageSize=10000').then((res) => {
    //   this.filters[2].options = res.results.map((v) => {
    //     const ob = {
    //       label: v.name,
    //       value: v.id,
    //     };
    //     return ob;
    //   });
    // });
  },
  methods: {
    tabClick() {
      // console.log(this.activeTab);
    },
    instantsearch() {

    },
    // 新建主机组
    createGroups() {
      console.log(this.hostGroups, 222);
      this.$refs.hostGroups.validate((vaild) => {
        if (vaild) {
          this.$axios.post('/back/instancegroups', this.hostGroups).then((res) => {
            if (res.rescode === 0) {
              this.$message.success('操作成功');
              this.groupsVisable = false;
              this.getInstance();
            }
          });
        }
      });
    },
    // 实例分组移除
    instanttDel(row, index) {
      const obj = {
        id: [row.id],
        instancegroup_id: Number(this.id),
      };
      this.$confirm('此操作将删除该主机, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/back/instances', { data: obj }).then((res) => {
          if (res.rescode === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getHosts();
          }
        });
        // console.log(row);
        // this.tData.splice(index, 1);
        console.log(index);
      }).catch(() => {
      });
    },
    instantsearchs() {
      // console.log('search');
      this.getInstance();
    },
    search() {
      console.log('search');
      this.getHosts();
    },
    clearSelection() {
      this.tableSearch.selection = [];
      this.serviceSearch.selection = [];
    },
    batchDel() {
      // this.batchDelVisible = true;
    },
    bindCluster() {
      this.bindVisible = true;
    },
    deleteHost() {
      const ids = this.delData.map(v => v.id);
      console.log(ids, 333);
      const obj = {
        id: ids,
        instancegroup_id: Number(this.id),
      };
    //   console.log(ids, obj);
      this.$axios.delete('/back/instances', { data: obj }).then((res) => {
        if (res.rescode === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.batchDelVisible = false;
          this.getHosts();
        }
      });
    },
    batchCommand(command) {
      if (this.serviceSearch.selection.length === 0) {
        this.$message.warning('请选择主机');
        return;
      }
      if (command === 'delete') {
        this.delData = this.serviceSearch.selection;
        this.batchDelVisible = true;
      }
    },
    tDel(row, index) {
      const obj = {
        id: [row.id],
        instancegroup_id: Number(this.id),
      };
      this.$confirm('此操作将删除该主机, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/back/instances', { data: obj }).then((res) => {
          if (res.rescode === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getHosts();
          }
        });
        // console.log(row);
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
    getInstance() {
      const formObj = {};
      formObj.name = this.filters[0].value;
      this.$axios.get('/back/instancegroups', { params: formObj }).then((res) => {
        console.log(res);
        if (res.rescode === 0) {
          this.instanttData = res.values;
        }
        // console.log(res);
      });
      // const obj = {};
      // obj.currentPage = this.serviceSearch.currentPage;
      // obj.pageSize = this.serviceSearch.pageSize;
      // obj.service_id = this.id;
      // if (this.serviceSearch.order) {
      //   obj.order = this.serviceSearch.order === 'descending' ? 'desc' : 'asc';
      // }
      // if (this.serviceSearch.prop) {
      //   obj.prop = this.serviceSearch.prop;
      // }
      // this.$axios.get('/back/instance/list', { params: obj }).then((res) => {
      //   this.serviceData = res.results;
      //   this.serviceSearch.total = res.total;
      //   // console.log(res);
      // });
    },
    getService() {
      this.$axios.get(`/back/servicedetail/${this.id}`).then((res) => {
        this.serviceDetails = res.service;
      });
    },
    getHosts() {
      this.$axios.get('/back/instances').then((res) => {
        console.log(res, 2223);
        if (res.rescode === 0) {
          this.serviceData = res.values;
          // this.getHosts();
        }
      });
      // const $vm = this;
      // const obe = {};
      // this.filters.forEach((v) => {
      //   obe[v.key] = v.value;
      // });
      // const formObj = Object.assign(obe, $vm.tableSearch);

      // Object.keys(formObj).forEach((k) => {
      //   if (!formObj[k]) delete formObj[k];
      // });
      // const obj = {};
      // obj.currentPage = this.tableSearch.currentPage;
      // obj.pageSize = this.tableSearch.pageSize;
      // obj.service_id = this.id;
      // if (this.tableSearch.order) {
      //   obj.order = this.tableSearch.order === 'descending' ? 'desc' : 'asc';
      // }
      // if (this.tableSearch.prop) {
      //   obj.prop = this.tableSearch.prop;
      // }
      // this.$axios.get('/back/search/hosts', { params: formObj }).then((res) => {
      //   if (res.status === 'ok') {
      //     this.tData = res.result.hosts;
      //     if (res.result.mapping) {
      //       delete res.result.mapping.fqdn;
      //       this.tColumns = Object.keys(res.result.mapping).map((v) => {
      //         // if (v === 'fqdn') return null;
      //         const obc = {};
      //         obc.prop = v;
      //         obc.label = res.result.mapping[v];
      //         obc.sortable = 'custom';
      //         return obc;
      //       });
      //     }
      //     this.tableSearch.total = res.result.total;
      //   }
      // });
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
.summary{
  border: 1px solid $border-color;
  background: #fff;
  padding: 15px 30px;
  margin: -18px -20px 18px;
  i.fa {
    font-size: 20px;
  }
  p{
    span{
      display: inline-block;
      padding:8px 20px;
      font-size: 14px;
    }
  }
  p.top{
    span{
      font-size: 18px;
    }
  }
  p.bottom {
    padding-left: 13px;
  }
}
.mannage{
    color: #fff !important;
}
</style>
