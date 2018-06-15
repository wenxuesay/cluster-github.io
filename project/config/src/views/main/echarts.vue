<template lang="pug">
  el-row(type="flex")
    el-col(:span="10")
      .sf-panel
        .panel-heading echarts组件
        .panel-body
          h4 使用示例
          pre
            code LinePieBar(id="my",:echartsData="echartsData")
          h4 业务扩展
          p(style="font-size:12px;") 不需要btn-group 在组件内注释按钮，或者修改样色，通过触发事件实现转换功能。
          p
          h4 数据格式
          pre
            code 
              |echartsData: {
              |   legend: ['event1', 'event2', 'event3'],
              |   xData: ['2017-09-27', '2017-09-28', '2017-09-29', '2017-09-30'],
              |   yData: [
              |     [12759, 12859, 12959, 13059],
              |     [22759, 22859, 22959, 23059],
              |     [32759, 32859, 32959, 33059],
              |   ],
              |}
      .sf-panel
        .panel-heading 一维数据示例
        .panel-body
          h4  格式示例
          pre 
            code
              |data: [
              | { dt: '2017-09-27', event_id: 'event1', event_dt: 'event01', count_value: 1684 },
              | { dt: '2017-09-27', event_id: 'event2', event_dt: 'event02', count_value: 2684 },
              | { dt: '2017-09-27', event_id: 'event3', event_dt: 'event03', count_value: 3684 },
              | { dt: '2017-09-28', event_id: 'event1', event_dt: 'event01', count_value: 4684 },
              | { dt: '2017-09-28', event_id: 'event2', event_dt: 'event02', count_value: 5684 },
              | { dt: '2017-09-28', event_id: 'event3', event_dt: 'event03', count_value: 6684 },
              |]
          h4 使用示例
          pre
            code
              |const columnMap = {
              |    // x x轴数据, regExp 数据值正则
              |    x: 'dt',
              |    regExp: '_value',
              |    dt: 'dt',
              |    event_id: 'event_id',
              |    event_dt: 'event_dt',
              |    count_value: 'count_value',
              |  };
              |  const obj = util.echartsFormat(columnMap, this.data);
              |  this.echartsData = obj.datas;
    el-col(:span="14")
      .btn-group
        button.btn-blue(@click="upData") 刷新数据(N维数据)
        button.btn-blue(@click='ajaxData') 刷新数据(一维数据)
      LinePieBar(id="my",:echartsData="echartsData")
</template>
<script>
import LinePieBar from '@/components/LinePieBar';
import util from '../../lib/util';

export default {
  components: {
    LinePieBar,
  },
  data() {
    return {
      echartsData: {
        legend: ['event1', 'event2', 'event3'],
        xData: ['2017-09-27', '2017-09-28', '2017-09-29', '2017-09-30'],
        yData: [
          [12759, 12859, 12959, 13059],
          [22759, 22859, 22959, 23059],
          [32759, 32859, 32959, 33059],
        ],
      },
      data: [
        { dt: '2017-09-27', event_id: 'event1', event_dt: 'event01', count_value: 1684 },
        { dt: '2017-09-27', event_id: 'event2', event_dt: 'event02', count_value: 2684 },
        { dt: '2017-09-27', event_id: 'event3', event_dt: 'event03', count_value: 3684 },
        { dt: '2017-09-28', event_id: 'event1', event_dt: 'event01', count_value: 4684 },
        { dt: '2017-09-28', event_id: 'event2', event_dt: 'event02', count_value: 5684 },
        { dt: '2017-09-28', event_id: 'event3', event_dt: 'event03', count_value: 6684 },
      ],
      service: {
        name: 'hello world!',
        analysisId: '1',
        isLoading: false,
        time: '2018-10-19',
      // time:[moment().subtract(14,'days').format("YYYY-MM-DD"),moment().format("YYYY-MM-DD")]
      },
    };
  },
  methods: {
    upData() {
      this.echartsData = {
        legend: ['更新数据1', '更新数据2', '更新数据4'],
        xData: ['2017-10-27', '2017-10-28', '2017-10-29', '2017-10-30'],
        yData: [
          [42759, 42859, 42959, 43059],
          [32759, 32859, 32959, 33059],
          [22759, 22859, 22959, 23059],
        ],
      };
    },
    ajaxData() {
      const columnMap = {
        // x x轴数据, regExp 数据值正则
        x: 'dt',
        regExp: '_value',
        dt: 'dt',
        event_id: 'event_id',
        event_dt: 'event_dt',
        count_value: 'count_value',
      };
      const obj = util.echartsFormat(columnMap, this.data);
      this.echartsData = obj.datas;
    },
  },
};
</script>

