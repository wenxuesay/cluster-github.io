<template lang="pug">
  div
    .summary
      p.top
        i.fa.fa-home
        span 集群:{{cluster.name}}
        span
          button.btn-primary 启动集群
          button.btn-primary 停止集群
      p.bottom
        span 创建时间: {{cluster.created_time}}
        span 创建人: {{cluster.creator}}
      el-tabs(@tab-click="tabClick",v-model='activeTab')
        el-tab-pane(label="集群服务",name="service")
        //- el-tab-pane(label="集群主机",name="host")
    .sf-panel(v-show="activeTab == 'service'")
      .panel-body
        .btn-group
          button.btn-primary(@click="addService") 添加服务
        sfTable(:tColumns='servicetColumns',:tData="servicetData")
          el-table-column(slot="a",label='服务名称')
            template(slot-scope="scope")
              router-link(:to="'/cluster/service/'+scope.row.id") {{scope.row.name}}
    .sf-panel(v-show="activeTab == 'host'")
      .panel-body
        sfsFilter(:filters.sync="filters")
        .btn-group
          button.btn-default(@click="batchDel") 批量删除主机
          button.btn-primary(@click="bindCluster") 添加主机到集群
        .info
          span 已选择
            .text {{tableSearch.selection.length}}
            | 项
          span(@click="clearSelection") 清空
        sfTable(:tColumns='tColumns',:tData="tData",:tableSearch.sync="tableSearch",type="selection",@search="search")
          el-table-column(slot="a",label='主机名')
            template(slot-scope="scope")
              router-link(:to="'/hosts/hostDetail/'+scope.row.id") {{scope.row.hostname}}
          el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 删除
    el-dialog.sf-form(title="添加服务",:visible.sync="serviceVisable",@close="resetFields('service')")
      el-form(:model="service",label-width="120px",:rules="serviceRules",ref="service")
        el-form-item(label="服务类型:",prop="type_id")
          el-select(v-model='service.type_id')
            el-option(v-for='(option,i) in serviceOptions',:key="i",:label="option.label",:value="option.value")
        el-form-item(label="服务名称:",prop="name")
          el-input(v-model='service.name')
      .dialog-footer(slot="footer")
        button.btn-default(@click="serviceVisable = false") 取消
        button.btn-primary(@click="saveService") 确定

</template>
<script>
import sfTable from '../../components/sfTable';
import sfsFilter from '../../components/sfsFilter';

export default {
  components: {
    sfTable,
    sfsFilter,
  },
  data() {
    return {
      activeTab: 'service',
      serviceRules: {
        name: [
            { required: true, message: '请填写集群名称', trigger: 'blur' },
        ],
        type_id: [
            { required: true, message: '请选择类型', trigger: 'blur' },
        ],
      },
      service: {
        type_id: '',
        name: '',
      },
      serviceOptions: [],
      serviceVisable: false,
      cluster: {
        name: '',
      },
      servicetColumns: [
          // { prop: 'name', label: '服务名称' },
          { prop: 'service_type', label: '类型' },
          { prop: 'instance_cnt', label: '实例数' },
          { prop: 'status', label: '状态' },
      ],
      servicetData: [
          // { id: 1, name: 'cnsz22VLK3846', label: 'hdfs', num: 48, status: '健康' },
      ],
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  mounted() {
    console.log(1111);
    this.$axios.get(`/back/clusterdetail/${this.id}`).then((res) => {
      this.servicetData = res.cluster.serviceList;
      this.cluster.name = res.cluster.name;
      this.cluster.created_time = res.cluster.created_time;
      this.cluster.creator = res.cluster.creator;
    });
    // console.log(this.)
    console.log(this.$route.matched[this.$route.matched.length - 1]);
    this.getService();
  },
  methods: {
    tabClick() {
    },
    getService() {
    //   this.$axios.get('/back/role/lists').then((res) => {
    //     if (res.status === 'ok') {
    //       this.serviceOptions = res.clusters.map((v) => {
    //         const obj = {
    //           label: v.name,
    //           value: v.id,
    //         };
    //         return obj;
    //       });
    //     }
    //   });
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
    saveService() {
        // console.log(this.service);
      this.service.cluster_id = this.id;
      this.$refs.service.validate((vaild) => {
        if (vaild) {
          this.$axios.post('/back/service/add', this.service).then((res) => {
            if (res.status === 'ok') {
              this.$message.success(res.message);
              this.serviceVisable = false;
              this.$axios.get(`/back/clusterdetail/${this.id}`).then((ress) => {
                this.servicetData = ress.cluster.serviceList;
              });
            }
          });
        }
      });
    },
    addService() {
      this.serviceVisable = true;
      // this.service.cluster_id = list.id;
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
