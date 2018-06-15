<template lang="pug">
  .main
    .sf-panel
      .panel-body
        .btn-group
          button.btn-blue(@click="clusterVisable = true") 新建集群
        el-row(:gutter="24",type="flex",v-for="(list,i) in clusterLists",v-if="i%2 == 0",:key="i")
          el-col(:span="24",style="margin-bottom:18px;")
            p.c-list
              router-link(:to="'/cluster/host/'+list.id") {{list.name}}
              //-button.btn-blue(@click="addService(list)") 添加服务
              //-i.fa.fa-minus(@click="list.show = !list.show")
              sfTable(:tColumns="tColumns",:tData="tData",v-show="list.show")
                el-table-column(slot="a",label='服务名称')
                  template(slot-scope="scope")
                    router-link(:to="'/cluster/host/clusterService/'+scope.row.id") {{scope.row.name}}
                el-table-column(slot="actions",label='操作')
                  template(slot-scope="scope")
                    //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
                    button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 移除
          //-el-col(:span="12",style="margin-bottom:18px;",v-if="i!=(clusterLists.length-1)")
            p.c-list
              router-link(:to="'/cluster/host/'+clusterLists[i+1].id") {{clusterLists[i+1].name}}
              button.btn-blue(@click="addService(clusterLists[i+1])") 添加服务
              i.fa.fa-minus(@click="clusterLists[i+1].show = !clusterLists[i+1].show")
              sfTable(:tColumns="tColumns",:tData="clusterLists[i+1].serviceList",v-show="clusterLists[i+1].show")
                el-table-column(slot="a",label='服务名称')
                  template(slot-scope="scope")
                    router-link(:to="'/cluster/service/'+scope.row.id") {{scope.row.name}}
      el-dialog.sf-form(title="新建集群",:visible.sync="clusterVisable",@close="resetFields('cluster')")
        el-form(:model="cluster",label-width="120px",:rules="formRules",ref="cluster")
          el-form-item(label="集群名称:",prop="name")
            el-input(v-model='cluster.name')
          el-form-item(label="备注:",prop="info")
            el-input(v-model='cluster.info')
        .dialog-footer(slot="footer")
          button.btn-default(@click="clusterVisable = false") 取消
          button.btn-primary(@click="saveForm") 确定
      el-dialog.sf-form(title="添加服务",:visible.sync="serviceVisable",@close="resetFields('service')")
        el-form(:model="service",label-width="120px",:rules="serviceRules",ref="service")
          el-form-item(label="服务类型:",prop="type_id")
            el-select(v-model='service.type_id')
              el-option(v-for="option in serviceOptions",:key="option.value",:label="option.label",:value="option.value")
          el-form-item(label="服务名称:",prop="name")
            el-input(v-model='service.name')
        .dialog-footer(slot="footer")
          button.btn-default(@click="serviceVisable = false") 取消
          button.btn-primary(@click="saveService") 确定

</template>
<script>
  // import moment from 'moment';
  import sfTable from '../../components/sfTable';
  import util from '../../lib/util';

  export default {
    components: {
      sfTable,
    },
    data() {
      return {
        cluster: {
          name: '',
          info: '',
        },
        clusterVisable: false,
        service: {
          type_id: '',
          name: '',
        },
        serviceOptions: [],
        serviceVisable: false,
        clusterLists: [
          {
            title: 'BDP离线集群',
            show: true,
            tData: [
              { serverName: '离线hdfs', type: 'HDFS', num: '24', status: '运行中' },
              { serverName: '离线yarn', type: 'yarn', num: '30', status: '运行中' },
              { serverName: '离线hbase', type: 'hbase', num: '20', status: '运行中' },
              { serverName: '离线spark', type: 'spark', num: '19', status: '运行中' },
            ],
            serviceList: [],
          },
        ],
        tColumns: [
          // { prop: 'name', label: '服务名称' },
          { prop: 'info', label: '信息' },
          { prop: 'services', label: '实例数' },
          { prop: 'createtime', label: '创建时间' },
          // { prop: 'status', label: '状态' },
        ],
        tData: [
// { taskId: '01', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
// { taskId: '02', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
// { taskId: '03', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
// { taskId: '04', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
// { taskId: '05', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
        ],
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
            { required: true, message: '请填写集群名称', trigger: 'blur' },
          ],
          taskName: [
            { required: true, message: '任务名称', trigger: 'blur' },
          ],
        },
        serviceRules: {
          name: [
            { required: true, message: '请填写集群名称', trigger: 'blur' },
          ],
          type_id: [
            { required: true, message: '请选择类型', trigger: 'blur' },
          ],
        },
        options: [
          { value: '001', label: '加急' },
        ],
      };
    },
    computed: {
      tableSearch() {
        const tableSearch = util.tableSearch();
        return tableSearch;
      },
    },
    mounted() {
      this.getCluster();
      this.getService();
    },
    /* eslint-disable no-console */
    methods: {
      search(obj) {
        console.log(obj);
      },
      saveService() {
        console.log(this.service);
        this.$refs.service.validate((vaild) => {
          if (vaild) {
            this.$axios.post('/back/service/add', this.service).then((res) => {
              if (res.status === 'ok') {
                this.$message.success(res.message);
                this.serviceVisable = false;
                this.getCluster();
              }
            });
          }
        });
      },
      addService(list) {
        this.serviceVisable = true;
        this.service.cluster_id = list.id;
      },
      tDel(row, index) {
        const obj = {
          id: row.id,
        };
        this.$confirm('此操作将永久删除该文件, 是否继续?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$axios.delete('/back/clusters', { data: obj }).then((res) => {
            if (res.rescode === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getCluster();
            }
          });
          console.log(row);
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
        this.$refs.cluster.validate((vaild) => {
          if (vaild) {
            this.$axios.post('/back/clusters', this.cluster).then((res) => {
              if (res.rescode === 0) {
                this.$message.success('添加成功');
                this.cluster.name = '';
                this.clusterVisable = false;
                console.log(this.clusterVisable, 222);
                this.getCluster();
              }
            });
          }
        });
      },
      createTask() {
        this.form = {
          appName: '',
          updatedAt: '',
          taskId: '',
          taskType: '',
        };
        this.formVisible = true;
      },
      getCluster() {
        // this.$axios.get('/back/clusters').then((res) => {
        //   this.clusterLists = res.cluster.map((v) => {
        //     const obj = Object.assign({}, v);
        //     obj.show = true;
        //     return obj;
        //   });
        // });
        // this.$axios.get('/back/servicetypes').then((res) => {
        //   console.log(res);
        //   res.values
        //   if (res.rescode === 0) {

        //   }
        // });
        this.$axios.get('/back/clusters').then((res) => {
          if (res.rescode === 0) {
            this.tData = res.values;
          }
        });
      },
      getService() {
        this.$axios.get('/back/role/lists').then((res) => {
          if (res.status === 'ok') {
            this.serviceOptions = res.clusters.map((v) => {
              const obj = {
                label: v.name,
                value: v.id,
              };
              return obj;
            });
          }
        });
      },
    },

  };
</script>
<style lang="scss">
.list{
  background: $pr;
  color:#fff;
  padding-top:20px;
  border-radius: $border-radius;
  p:nth-child(1){
    font-size: 30px;
    padding:0 10px;
    margin-bottom: 0;
  }
  p:nth-child(2){
    padding:0 30px;
    font-size: 16px;
    margin-bottom:18px;
  }
  p:nth-child(3){
    font-size: 14px;
    padding:10px 20px;
    background: #44AFDD;
    text-align: center;
    border-bottom-left-radius: $border-radius;
    cursor: pointer;
  }
  &.fixed{
    background: $se;
    p:nth-child(3){
      background: #53C5AC;
    }
  }
}
p.c-list {
  border: 1px solid $border-color;
  margin: 0;
  padding:10px 30px 10px 15px;
  .fa{
    font-size: 20px;
    float:right;
  }
}
</style>
