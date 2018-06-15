<template lang="pug">
  el-row(type="flex")
    el-col(:span="12")
      .sf-panel
        .panel-heading
          | 表单相关
        .panel-body
          h4 命名规范 form为表单对象名称,formRule为表单校验规则
          h4 formVisable为el-dialog显示控制(添加.sf-form 控制样式)
          pre
            code
              |el-dialog.sf-form(title="编辑任务",:visible.sync="formVisible",@close="resetFields('form')")
              | el-form(:model="form",label-width="120px",:rules="formRules",ref="form")
              |   el-form-item(label="任务名称:",prop="taskName")
              |     el-input(v-model="form.taskName",placeholder="请选择")
              |   el-form-item(label="创建时间:",prop="time")
              |     el-date-picker(v-model="form.time",type="date")
              |   el-form-item(label="修改时间:",prop="updatedAt")
              |     el-date-picker(v-model="form.updatedAt",type="daterange")
              |   el-form-item(label="任务ID:",prop="taskId")
              |     el-input(v-model="form.taskId")
              |   el-form-item(label="任务类型:",prop="taskType")
              |     el-select(v-model="form.taskType")
              |       el-option(v-for="option in options",:label="option.label",:key="option.value",:value="option.value")
              | .dialog-footer(slot="footer")
              |   button.btn-blue(@click="saveForm") 确定
              |   button.btn-primary(@click="formVisible = false") 取消
          h4 数据格式
          pre
            code 
            |  form: {
            |    taskName: '',
            |    time: '',
            |    updatedAt: '',
            |    taskId: '',
            |    taskType: '',
            |  },
    el-col(:span="12")
      .sf-panel
        .panel-heading
          | 表单校验
        .panel-body
          h4 rule代码
          pre
            code
              |formRules: {
              |  taskName: [
              |    { required: true, message: '任务名称', trigger: 'blur' },
              |  ],
              |  time: [
              |    { type: 'date', required: true, message: '请选择日期', trigger: 'blur' },
              |  ],
              |  updatedAt: [
              |    { type: 'array', required: true, message: '请选择日期', trigger: 'blur' },
              |  ],
              |  taskId: [
              |    { required: true, message: '任务ID', trigger: 'blur' },
              |  ],
              |  taskType: [
              |    { required: true, message: '任务类型', trigger: 'blur' },
              |  ],
              |},
          h4 saveFrom,sest方法
          pre
            code 
              |
              |this.$refs.form.validate((vaild) => {
              | if (vaild) {
              |  console.log(this.form);
              |  this.form.time = moment(this.form.time).format('YYYY-MM-DD');
              |  this.form.updatedAt = this.form.updatedAt.map(v => moment(v).format('YYYY-MM-DD'));
              |  console.log(JSON.stringify(this.form));
              | }
              |});
              |
              |resetFields(type) {
              |  this.$refs[type].resetFields();
              |},
</template>
