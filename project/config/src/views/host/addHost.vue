<template lang="pug">
  .main
    .sf-panel
      .panel-body
        .steps
          .step
            .step-num 
              .text 1
            .step-text 填写主机信息
            .step-line
          .step
            .step-num
              .text 2
            .step-text 主机检测结果
            .step-line
          .step
            .step-num
              .text 3
            .step-text 安装Agent
        .add-1(v-show="step==1")
          el-form(:model="form",label-width="140px",:rules="formRules",ref="form")
            el-form-item(label="用户名:",prop="taskName")
              el-input(v-model="form.taskName",placeholder="请输入")
            el-form-item(label="密码:",prop="time")
              el-input(v-model="form.time",type="password",placeholder="请输入")
            el-form-item(label="输入主机名或IP:",prop="updatedAt")
              el-input(v-model="form.updatedAt",type="textarea",placeholder="每行一条主机名或IP信息，支持批量写法，例如hadoop[11-15].sfdc.com",:autosize="{ minRows: 4}")
            //- el-form-item(label="任务类型:",prop="taskType")
            //-   el-select(v-model="form.taskType")
            //-     el-option(v-for="option in options",:label="option.label",:key="option.value",:value="option.value")
            el-form-item
              button.btn-primary(@click.prevent="step = 2") 下一步
        .add-2(v-show="step==2")
          el-row(:gutter="15")
            el-col.label(:span="4") 检测进度:
            el-col(:span="19")
              el-progress(:text-inside="true",:stroke-width="18",:percentage="70")
          el-row(:gutter="15")
            el-col.label(:span="4") 检测结果:
            el-col(:span="19")
              sfTable(:tColumns='tColumns',:tData="tData",:tableSearch="tableSearch",type="selection",@search="search")
              .btn-group
                button.btn-default(@click="step = 1") 上一步
                button.btn-primary(@click="step = 3") 安装Agent
        .add-3(v-show="step==3")
          el-row(:gutter="15")
            el-col.label(:span="4") Agent安装进度:
            el-col(:span="19")
              el-progress(:text-inside="true",:stroke-width="18",:percentage="70")
          el-row(:gutter="15")
            el-col.label(:span="4") Agent安装结果:
            el-col(:span="19")
              sfTable(:tColumns='tColumns',:tData="tData",:tableSearch="tableSearch",type="selection",@search="search")
              .btn-group
                button.btn-default(@click="step = 2") 上一步
                button.btn-primary 重试所有主机
                a.btn-primary(href="/hosts") 完成
    el-dialog.sf-form(title="编辑任务",:visible.sync="formVisible",@close="resetFields('form')")
      el-form(:model="form",label-width="120px",:rules="formRules",ref="form")
        el-form-item(label="任务名称:",prop="taskName")
          el-input(v-model="form.taskName",placeholder="请选择")
        el-form-item(label="创建时间:",prop="time")
          el-date-picker(v-model="form.time",type="date")
        el-form-item(label="修改时间:",prop="updatedAt")
          el-date-picker(v-model="form.updatedAt",type="daterange")
        el-form-item(label="任务ID:",prop="taskId")
          el-input(v-model="form.taskId")
        el-form-item(label="任务类型:",prop="taskType")
          el-select(v-model="form.taskType")
            el-option(v-for="option in options",:label="option.label",:key="option.value",:value="option.value")
      .dialog-footer(slot="footer")
        button.btn-blue(@click="saveForm") 确定
        button.btn-primary(@click="formVisible = false") 取消
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
  methods: {
    search(obj) {
      console.log(obj);
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
  },
  // computed: {
  //   tableSearch() {
  //     const tableSearch = util.tableSearch({ selection: [] });
  //     return tableSearch;
  //   },
  // },
  data() {
    return {
      step: 1,
      tableSearch: util.tableSearch({ selection: [] }),
      tColumns: [
          { prop: 'taskId', label: '任务ID', sortable: 'custom' },
          { prop: 'taskName', label: '任务名称' },
          { prop: 'taskType', label: '任务类型' },
          { prop: 'taskInfo', label: '任务调度信息' },
          { prop: 'nodeInfo', label: '冻结' },
          { prop: 'frez', label: '修改时间' },
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
};
</script>
<style lang="scss">
.add-1,.add-2,.add-3{
  max-width: 800px;
  margin:0 auto;
  .label{
    text-align: right;
    margin-bottom: 18px;
  }
}
.steps {
  width: 1200px;
  margin: 18px auto;
  .step {
    display: inline-block;
    .step-num{
      vertical-align: middle;
      display: inline-block;
      position: relative;
      background-color: $pr;
      border-radius: 15px;
      height: 30px;
      width: 30px;
      color: #fff;
      margin-right: 10px;
      // line-height: 50px; 
      .text {
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
    .step-text{
      display: inline-block;
    }
    .step-line {
      position: relative;
      top: -5px;
      display: inline-block;
      width: 350px;
      border-top: 1px solid $border-color;
      margin:0 10px;
    }
  }
}
</style>

