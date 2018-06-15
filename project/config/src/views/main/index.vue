<template lang="pug">
  .main
    .sf-panel
      .panel-body
        el-row(:gutter="20")
          el-col(:span="6",v-for="(list,i) in viewLists",:key="i")
            .list(:class="i > 3 ? 'fixed':''")
              p
                router-link.num(:to="list.path",:class="list.status =='failed' ? 'red':''") {{list.num}}
              p {{list.name}}
              p
                router-link(:to="list.path") 查看详情
    .sf-panel
      .panel-body
        el-row(:gutter="20",type="flex",v-for="(list,i) in clusterLists",v-if="i%2 == 0",:key="i")
          el-col(:span="12",style="margin-bottom:18px;")
            p.c-list
              router-link(:to="'/cluster/host/'+list.id") {{list.name}}
              i.fa.fa-minus(@click="list.show = !list.show")
            sfTable(:tColumns="tColumns",:tData="list.serviceList",v-show="list.show")
              el-table-column(slot="a",label='服务名称')
                template(slot-scope="scope")
                  router-link(:to="'/cluster/service/'+scope.row.id") {{scope.row.name}}
          el-col(:span="12",style="margin-bottom:18px;",v-if="i != (clusterLists.length -1)")
            p.c-list
              router-link(:to="'/cluster/host/'+clusterLists[i+1].name") {{clusterLists[i+1].name}}
              i.fa.fa-minus(@click="clusterLists[i+1].show = !clusterLists[i+1].show")
            sfTable(:tColumns="tColumns",:tData="clusterLists[i+1].serviceList",v-show="clusterLists[i+1].show")
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
        viewLists: [
          { num: 0, name: '主机', path: '/host/hosts' },
          { num: 0, name: '未绑定主机', path: '/host/hosts?unbond=true' },
          { num: 0, name: '异常主机', path: '/host/hosts?status=failed' },
          { num: 0, name: '主机组', path: '/host/groups' },
          { num: 0, name: '集群', path: '/cluster/host' },
          { num: 0, name: '服务', path: '/cluster/service' },
          { num: 0, name: '异常服务', path: '/cluster/service' },
          { num: 0, name: '未绑定实例', path: '/cluster/service/addhost' },
        ],
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
          },
        ],
        tColumns: [
          { prop: 'name', label: '服务名称' },
          { prop: 'service_type', label: '类型' },
          { prop: 'instance_cnt', label: '实例数' },
          { prop: 'status', label: '状态' },
        ],
        tData: [
            { name: 11111, service_type: 2222, instance_cnt: 33333, status: '未完成' },
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
    computed: {
      tableSearch() {
        const tableSearch = util.tableSearch();
        return tableSearch;
      },
    },
    /* eslint-disable no-console */
    methods: {
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
    },
    mounted() {
      console.log(2222333);
      const $vm = this;
      this.$axios.get('back/v1.0/hostgroups').then((res) => {
        console.log(res, 55556);
      });
      this.$axios.get('back/clusters/list').then((res) => {
        if (res.status === 'ok') {
          this.clusterLists = res.cluster.map((v) => {
            const obj = Object.assign({}, v);
            obj.show = true;
            return obj;
          });
        }
      });
      this.$axios.get('back/overview').then((res) => {
        if (res.status === 'ok') {
          Object.values(res.overview).forEach((v, i) => {
            const obj = Object.assign({}, $vm.viewLists[i]);
            obj.num = v.num;
            obj.status = v.status;
            $vm.viewLists.splice(i, 1, obj);
          });
        }
      });
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
    a.num{
      font-size: 30px;
      padding:0 10px;
      color: #fff;
      margin-bottom: 0;
    }
    a.num.red {
      color: red;
    }
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
    a{
      text-decoration: none;
      color:#fff;
    }
  }
  &.fixed{
    background: $se;
    p:nth-child(3){
      background: #53C5AC;
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
}
p.c-list {
  border: 1px solid $border-color;
  margin: 0;
  padding:10px 30px 10px 15px;
  a{
    &:link,&:visited,&:hover,&:active{
      color: $pr;
    }
  }
}


</style>
