<template lang="pug">
    .sf-panel
      .panel-body
        sfsFilter(:filters.sync="filters",:search="searchData")
        .btn-group
          button.btn-blue(@click="batchDel") 批量移除主机
        .info
          span 已选择
            .text {{tableSearch.selection.length}}
            | 项
          span(@click="clearSelection") 清空
        sfTable(:tColumns='tColumns',:tData="tData",:tableSearch.sync="tableSearch",type="selection",@search="search")
          el-table-column(slot="actions",label='操作')
            template(slot-scope="scope")
              //- button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              button.btn-red.btn-tiny(@click="tDel(scope.row,scope.$index)") 移除主机
      el-dialog.sf-form(title="批量删除主机",:visible.sync="batchDelVisible",@close="comdel = ''")
        p 确定删除以下 {{deldata.length}}台 主机 ？
        sfTable(:tColumns='tColumns',:tData="deldata",@search="search")
        .dialog-footer(slot="footer")
          span *删除操作需输入大写字母DELETE：
          el-input.inline(v-model="comdel")
          button.btn-default(@click="batchDelVisible = false") 取消
          button.btn-primary(@click="saveForm") 确定
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
// import moment from 'moment';
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
      tableSearch: util.tableSearch(),
      // selection: [],
      // 主机组详情
      deldata: [],
      hostGroups: {
        selected: '',
        options: [{
          label: '离线',
          value: '离线',
        }],
      },
      filters: [
        { label: '主机名或IP:', key: 'appName', placeholder: '请选择', type: 'input', value: '' },
        { label: '状态:', key: 'status', placeholder: '请选择', type: 'input', options: [{ label: '测试', value: 'test' }], value: '' },
      ],
      tColumns: [
          { prop: 'name', label: '实例组名称' },
          { prop: 'info', label: '信息' },
          { prop: 'instances', label: '实例数' },
      ],
      tData: [
          { id: 1, hostname: 'cnsz22VLK3846', host_ip: '10.202.105.96', agent: '5s', CPU: 48, merroy: '256GB', disk: '60TB', status: '健康', group: '未分组', cluster: 'bdp' },
          { id: 2, hostname: 'cnsz22VLK3846', host_ip: '10.202.105.96', agent: '5s', CPU: 48, merroy: '256GB', disk: '60TB', status: '健康', group: '未分组', cluster: 'bdp' },
          { id: 3, hostname: 'cnsz22VLK3846', host_ip: '10.202.105.96', agent: '5s', CPU: 48, merroy: '256GB', disk: '60TB', status: '健康', group: '未分组', cluster: 'bdp' },
          { id: 4, hostname: 'cnsz22VLK3846', host_ip: '10.202.105.96', agent: '5s', CPU: 48, merroy: '256GB', disk: '60TB', status: '健康', group: '未分组', cluster: 'bdp' },
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
  mounted() {
    console.log(2222223);
    this.getGroup();
    // this.$route.meta.title = '你好';
    // console.log(this.$route.meta.title);
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    search() {
      this.getGroup();
    },
    searchData() {
      this.getGroup();
    },
    clearSelection() {
      this.tableSearch.selection = [];
    },
    batchDel() {
      this.deldata = this.tableSearch.selection;
      this.batchDelVisible = true;
    },
    tDel(row) {
      const obj = {
        id: row.id,
        // hostgroup_id: row.hostgroup,
      };
      this.$confirm('此操作将删除该主机, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/back/instancegroups', { data: obj }).then((res) => {
          if (res.rescode === 0) {
            this.$message({
              type: 'success',
              message: '移除成功!',
            });
            this.getGroup();
          }
        });
        // this.tData.splice(index, 1);
        // console.log(index);
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
    // 批量移除主机
    saveForm() {
      const ids = this.deldata.map(v => v.id);
      const hostgroup = this.deldata.map(v => v.hostgroup);
      const join = Array.from(new Set(hostgroup));
      const obj = {
        id: ids,
        hostgroup_id: join[0],
      };
      this.$axios.delete('/back/hosts', { data: obj }).then((res) => {
        if (res.rescode === 0) {
          this.$message({
            type: 'success',
            message: '移除成功!',
          });
          this.batchDelVisible = false;
          this.getGroup();
        }
      });
        // this.form.updatedAt = new Date(this.form.updatedAt);
      // console.log(this.form.updatedAt);
      // this.$refs.form.validate((vaild) => {
      //   if (vaild) {
      //     console.log(this.form);
      //     this.form.time = moment(this.form.time).format('YYYY-MM-DD');
      //     this.form.updatedAt = this.form.updatedAt.map(v => moment(v).format('YYYY-MM-DD'));
      //     console.log(JSON.stringify(this.form));
      //   }
      // });
    },
    getGroup() {
      let formObj = {};
      formObj.name = this.id;
    //   formObj.currentPage = this.tableSearch.currentPage;
    //   formObj.pageSize = this.tableSearch.pageSize;
      const obe = {};
      this.filters.forEach((v) => {
        if (v.value) {
          obe[v.key] = v.value;
        }
      });
      if (this.tableSearch.order) {
        formObj.order = this.tableSearch.order === 'descending' ? 'desc' : 'asc';
      }
      if (this.tableSearch.prop) {
        formObj.prop = this.tableSearch.prop;
      }
      formObj = Object.assign(formObj, obe);
      this.$axios.get('/back/host_services').then((res) => {
        this.filters[1].options = res.values;
        //  this.hostGroups.options = res.values;
      });
      // console.log(formObj, 1111);
      this.$axios.get('/back/instancegroups', { params: formObj }).then((res) => {
        if (res.rescode === 0) {
          this.tData = res.values;
        //   if (res.result.mapping) {
        //     delete res.result.mapping.fqdn;
        //     this.tColumns = Object.keys(res.result.mapping).map((v) => {
        //       const obc = {};
        //       obc.prop = v;
        //       obc.label = res.result.mapping[v];
        //       // obc.sortable = 'custom';
        //       return obc;
        //     });
        //   }
        //   this.tableSearch.total = res.result.total;
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


