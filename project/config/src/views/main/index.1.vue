<template lang="pug">
  el-row(type="flex")
    el-col(:span="10")
      .sf-panel
        .panel-heading 按钮
        .panel-body
          h4 使用示例(可以直接覆盖elementbutton)
          pre
            code
              |.btn-group
              |  button.btn-primary 原始按钮 
              |  button.btn-blue 默认按钮
              |  button.btn-red 删除按钮
              |  button.btn-dis 禁用按钮
              |.btn-group
              |  button.btn-primary.btn-lg 大型按钮
              |  button.btn-primary 标准按钮
              |  button.btn-primary.btn-sm 小型按钮
              |  button.btn-primary.btn-tiny 迷你按钮
              |  button.btn-blue(@click="createTask") 新建任务
      .sf-panel
        .panel-heading 
          | sfsFilter
        .panel-body
          | 使用示例 参考组件(目前只适用样式,后期修改)
      .sf-panel
        .panel-heading 
          | sfTable
        .panel-body
          h4 使用示例(通过@search响应相关操作更改tData) 
          h4 (type="selection"开启checkbox,通过tableSeach开启分页)
          pre
            code
              | sfTable(:tColumns='tColumns',:tData="tData",:tableSeach="tableSeach",type="selection",@search="search")
              |   el-table-column(slot="actions",label='操作')
              |     template(slot-scope="scope")
              |        button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
              |        button.btn-red.btn-tiny(@click="tDel(scope.row,scope.index)") 删除
          h4 代码示例
          pre
            code
              |  computed: {
              |    tableSeach() {
              |      const tableSeach = util.tableSeach();
              |      return tableSeach;
              |    },
              |  },
              |  tColumns: [
              |    { prop: 'taskId', label: '任务ID', sortable: 'custom' },
              |    { prop: 'taskName', label: '任务名称' },
              |    { prop: 'taskType', label: '任务类型' },
              |    { prop: 'taskInfo', label: '任务调度信息' },
              |    { prop: 'nodeInfo', label: '冻结' },
              |    { prop: 'frez', label: '修改时间' },
              |  ],
    el-col(:span="14")
      .btn-group
        button.btn-primary 原始按钮 
        button.btn-blue 默认按钮
        button.btn-red 删除按钮
        button.btn-dis 禁用按钮
      .btn-group
        button.btn-primary.btn-lg 大型按钮
        button.btn-primary 标准按钮
        button.btn-primary.btn-sm 小型按钮
        button.btn-primary.btn-tiny 迷你按钮
        button.btn-blue(@click="createTask") 新建任务
      sfsFilter
      sfTable(:tColumns='tColumns',:tData="tData",:tableSeach="tableSeach",type="selection",@search="search")
        el-table-column(slot="actions",label='操作')
          template(slot-scope="scope")
            button.first.btn-blue.btn-tiny(@click="tEdit(scope.row,scope.index)") 编辑
            button.btn-red.btn-tiny(@click="tDel(scope.row,scope.index)") 删除
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
  import sfsFilter from '../../components/sfsFilter';
  import sfTable from '../../components/sfTable';
  import util from '../../lib/util';

  export default {
    components: {
      sfsFilter,
      sfTable,
    },
    data() {
      return {
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
    computed: {
      tableSeach() {
        const tableSeach = util.tableSeach();
        return tableSeach;
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
  };
</script>
