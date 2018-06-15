<template lang="pug">
    .sf-panel
      .panel-body
        .btn-group
          el-dropdown(@command="bindCommand",trigger="click")
            span.el-dropdown-link
              | 未绑定实例
              i.el-icon-arrow-down.el-icon--right
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(command="bind") 绑定实例
        el-row(:gutter="24",type="flex",v-for="(list,i) in serviceLists",v-if="i%2 == 0",:key="i")
          el-col(:span="24",style="margin-bottom:18px;")
            p.c-list 
              span {{list.name}}
              //-i.fa.fa-minus(@click="list.show = !list.show")
              sfTable(:tColumns="tColumns",:tData="tData")
                el-table-column(slot="a",label='服务名称')
                  template(slot-scope="scope")
                    router-link(:to="'/cluster/service/'+scope.row.id") {{scope.row.name}}
          //-el-col(:span="12",style="margin-bottom:18px;",v-if="i != (serviceLists.length - 1)")
            p.c-list
              span {{serviceLists[i+1].name}}
              i.fa.fa-minus(@click="serviceLists[i+1].show = !serviceLists[i+1].show")
            sfTable(:tColumns="tColumns",:tData="serviceLists[i+1].serviceList",v-show="serviceLists[i+1].show")
              el-table-column(slot="a",label='服务名称')
                template(slot-scope="scope")
                  router-link(:to="'/cluster/service/'+scope.row.id") {{scope.row.name}}
</template>
<script>
  import moment from 'moment';
  import sfTable from '../../components/sfTable';
  import util from '../../lib/util';

  export default {
    components: {
      sfTable,
    },
    data() {
      return {
        serviceLists: [
          {
            title: 'BDP离线集群',
            show: true,
            tData: [
              { serverName: '离线hdfs', type: 'HDFS', num: '24', status: '运行中' },
              { serverName: '离线yarn', type: 'yarn', num: '30', status: '运行中' },
              { serverName: '离线hbase', type: 'hbase', num: '20', status: '运行中' },
              { serverName: '离线spark', type: 'spark', num: '19', status: '运行中' },
            ],
          },
        ],
        tColumns: [
          // { prop: 'name', label: '服务名称' },
          { prop: 'servicetype_id', label: '类型' },
          { prop: 'instances', label: '实例数' },
          { prop: 'stat', label: '状态' },
        ],
        tData: [
          { taskId: '01', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
          { taskId: '02', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
          { taskId: '03', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
          { taskId: '04', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
          { taskId: '05', taskName: 'HIVE', taskType: 'mysql', nodeInfo: 'mysql_ccs5', frez: '冻结' },
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
        },
        options: [
          { value: '001', label: '加急' },
        ],
      };
    },
    mounted() {
      this.getServices();
    },
    computed: {
      tableSearch() {
        const tableSearch = util.tableSearch();
        return tableSearch;
      },
    },
    /* eslint-disable no-console */
    methods: {
      bindCommand(com) {
        if (com === 'bind') {
          this.$router.push({ path: '/cluster/service/addhost' });
        }
      },
      search(obj) {
        console.log(obj);
      },
      tDel(row, index) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
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
      createTask() {
        this.form = {
          appName: '',
          updatedAt: '',
          taskId: '',
          taskType: '',
        };
        this.formVisible = true;
      },
      getServices() {
        this.$axios.get('/back/services').then((res) => {
          if (res.rescode === 0) {
            this.tData = res.values;
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
    position: relative;
    top: -11px;
  }
}
</style>
