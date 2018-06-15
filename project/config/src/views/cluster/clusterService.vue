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
        //-el-tab-pane(label="实例列表",name="service")
        el-tab-pane(label="集群服务",name="host")
    //-.sf-panel(v-show="activeTab == 'service'")
      .panel-body
        //- .btn-group
          button.btn-primary 添加服务
        sfTable(:tColumns='serviceColumns',:tData="serviceData",:tableSearch.sync="serviceSearch",@search="sSearch")
          //- el-table-column(slot="a",label='服务名称')
            template(slot-scope="scope")
              router-link(:to="'/service/'+scope.row.id") {{scope.row.name}}
    .sf-panel(v-show="activeTab == 'host'")
      .panel-body
        .btn-group
          button.btn-primary(@click="addService") 添加服务
        sfTable(:tColumns='serviceColumns',:tData="serviceData",:tableSearch.sync="serviceSearch",@search="sSearch")
          el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 移除
        //-.btn-group
          //- button.btn-default(@click="batchDel") 批量删除主机
          //- button.btn-primary(@click="bindCluster") 添加主机到服务
        //-.info
          span 已选择 
            .text {{tableSearch.selection.length}} 
            | 项
          span(@click="clearSelection") 清空
        //-sfTable(:tColumns='tColumns',:tData="tData",:tableSearch.sync="tableSearch",@search="search")
          el-table-column(slot="a",label='主机名',width="180px")
            template(slot-scope="scope")
              router-link(:to="'/host/hosts/hostDetail/'+scope.row.id") {{scope.row.fqdn}}
          //- el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 删除
    el-dialog.sf-form(title="添加服务",:visible.sync="serviceVisable",@close="resetFields('service')")
      el-form(:model="service",label-width="120px",:rules="serviceRules",ref="service")
        el-form-item(label="服务类型:",prop="servicetype_id")
          el-select(v-model='service.servicetype_id')
            el-option(v-for="option in serviceOptions",:key="option.value",:label="option.label",:value="option.value")
        el-form-item(label="服务名称:",prop="name")
          el-input(v-model='service.name')
      .dialog-footer(slot="footer")
        button.btn-default(@click="serviceVisable = false") 取消
        button.btn-primary(@click="saveService") 确定
    el-dialog.sf-form(title="批量删除主机",:visible.sync="batchDelVisible",@close="comdel = ''")
      p 确定删除以下 4台 主机 ？
      sfTable(:tColumns='tColumns',:tData="tData",@search="search")
      .dialog-footer(slot="footer")
        span *删除操作需输入大写字母DELETE：
        el-input.inline(v-model="comdel")
        button.btn-default(@click="batchDelVisible = false") 取消
        button.btn-primary(@click="saveForm") 确定
      //-el-dialog.sf-form(title="分配主机组",:visible.sync="distributionVisible",@close="resetFields('hostGroups')")
        el-form(:model="hostGroups",label-width="120px",:rules="formRules",ref="hostGroups")
          el-form-item(label="选择主机组:",prop="hSelected")
            el-select(v-model="hostGroups.selected")
              el-option(v-for="option in hostGroups.options",:label="option.label",:key="option.value",:value="option.value")
        sfTable(:tColumns='tColumns',:tData="tData",type="selection",@search="search")
        .dialog-footer(slot="footer")
          button.btn-default(@click="distributionVisible = false;comdel = ''") 取消
          button.btn-primary(@click="saveForm") 确定
      //-el-dialog.sf-form(title="绑定主机",:visible.sync="bindVisible",@close="resetFields('hostGroups')")
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
      serviceVisable: false,
      serviceOptions: [],
      service: {},
      serviceRules: {
        name: [
            { required: true, message: '请填写集群名称', trigger: 'blur' },
        ],
        type_id: [
            { required: true, message: '请选择类型', trigger: 'blur' },
        ],
      },
      // 确认删除
      serviceDetails: {
        name: '',
        create_time: '',
        creator: '',
      },
      activeTab: 'host',
      comdel: '',
      tableSearch: util.tableSearch({ selection: [] }),
      serviceSearch: util.tableSearch(),
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
        { label: '主机名或IP:', key: 'appName', placeholder: '请选择', type: 'input', value: '' },
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
        { label: '主机组:', key: 'group_id', placeholder: '请选择', type: 'input', options: [{ label: '测试', value: 'test' }], value: '' },
      ],
      tColumns: [
      ],
      tData: [
      ],
      serviceColumns: [
          // { prop: 'id', label: 'id', sortable: 'custom' },
          // { prop: 'run_user', label: '用户', sortable: 'custom' },
          // { prop: 'pid', label: 'PID', sortable: 'custom' },
          // { prop: 'proc_name', label: '进程名', sortable: 'custom' },
          // { prop: 'ip', label: 'IP地址', sortable: 'custom' },
          { prop: 'name', label: '服务名称' },
          { prop: 'servicetype_id', label: '类型' },
          { prop: 'instances', label: '实例数' },
          { prop: 'stat', label: '状态' },
          // { prop: 'status', label: '状态', sortable: 'custom' },
      ],
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
    // this.getInstance();
    this.getHosts();
  },
  methods: {
    tabClick() {
      // console.log(this.activeTab);
    },
    saveService() {
      console.log(this.service);
      this.$refs.service.validate((vaild) => {
        if (vaild) {
          const obj = {
            name: this.service.name,
            servicetype_id: this.service.servicetype_id,
            cluster_id: Number(this.id),
          };
          this.$axios.post('/back/services', obj).then((res) => {
            if (res.rescode === 0) {
              this.$message.success(res.resmsg);
              this.serviceVisable = false;
              this.getHosts();
            }
          });
        }
      });
    },
    addService() {
      this.serviceVisable = true;
    },
    sSearch() {
      // console.log('search');
      this.getInstance();
    },
    search() {
      console.log('search');
      this.getHosts();
    },
    clearSelection() {
      this.tableSearch.selection = [];
    },
    batchDel() {
      this.batchDelVisible = true;
    },
    bindCluster() {
      this.bindVisible = true;
    },
    tDel(row, index) {
      console.log(row);
      const obj = {
        id: row.id,
      };
      this.$confirm('此操作将删除该主机, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/back/services', { data: obj }).then((res) => {
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
      const obj = {};
      obj.currentPage = this.serviceSearch.currentPage;
      obj.pageSize = this.serviceSearch.pageSize;
      obj.service_id = this.id;
      if (this.serviceSearch.order) {
        obj.order = this.serviceSearch.order === 'descending' ? 'desc' : 'asc';
      }
      if (this.serviceSearch.prop) {
        obj.prop = this.serviceSearch.prop;
      }
      this.$axios.get('/back/instance/list', { params: obj }).then((res) => {
        this.serviceData = res.results;
        this.serviceSearch.total = res.total;
        // console.log(res);
      });
    },
    getService() {
      this.$axios.get(`/back/servicedetail/${this.id}`).then((res) => {
        this.serviceDetails = res.service;
      });
    },
    getHosts() {
      this.$axios.get('/back/servicetypes').then((res) => {
        if (res.rescode === 0) {
          res.values.map((v) => {
            this.serviceOptions.push({
              label: v.name,
              value: v.id,
            });
          });
        }
      });
      const obj = {
        cluster_id: Number(this.id),
      };
      this.$axios.get('/back/services', { params: obj }).then((res) => {
        console.log(res);
        if (res.rescode === 0) {
          this.serviceData = res.values;
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
</style>
