<template lang="pug">
.karnel-commen
  .header
    button.btn-blue(@click="drawline('line')",) 切换折线图
    button.btn-primary(@click="drawline('bar')") 切换柱状图
    button.btn-red(@click="drawpie()") 切换饼状图
    //- el-row(type="flex")
    //- 	el-col(:span="12")
    //- 		.title.center(v-if='service')
    //- 			.number {{service.name}}
    //- 		.timer(v-if="service && service.time")
    //- 			el-date-picker(v-model="service.time",type="date",placeholder="选择日期范围",range-separator="到")
    //- 	el-col.addSelect(:span="14")
    //- 	el-col.type(:span="3")
    //- 		.sf-graph.pull-right(:span="12",v-show="!service.isLoading")
    //- 			span(@click="sfshow=!sfshow")
    //- 				i(:class="sfGraph.find(item=>item.selected).line")
    //- 			transition(name='el-zoom-in-top')
    //- 				ul.list(v-show="sfshow",:class="{sfshow:sfshow}")
    //- 					li(v-for="(graph,$index) in sfGraph")
    //- 						i(:class="graph.line",@click="cut_type($index)")
    .commen(:id="id")
    slot(name="footer")
</template>

<script>
export default {
  props: ['echartsData', 'id', 'type', 'service'],
  data() {
    return {
      myChart: '',
      option: '',
      echartsType: '',
    };
  },
  computed: {
    // echartsType: {
    //   get() {
    //     if (this.type) {
    //       return this.type[0];
    //     }
    //   },
    //   set(newVal) {
    //     return newVal;
    //   },
    // },
  },
  mounted() {
    const id = document.getElementById(`${this.id}`);
    if (this.type) {
      this.echartsType = this.type[0];
    } else {
      this.echartsType = 'line';
    }
    if (!id) return;
    this.myChart = this.$echarts.init(id);
    window.onresize = () => (() => {
      this.myChart.resize();
    })();
    if (this.echartsData && this.echartsData.legend.length !== 0) {
      if (this.echartsType === 'bar') {
        this.drawline('bar');
      } else if (this.echartsType === 'line') {
        this.drawline('line');
      } else {
        this.drawpie();
      }
      // this.myChart.setOption(this.option);
    }
  },
  methods: {
    /* 绘制折线图以及柱状图 */
    drawline(type) {
      if (type) {
        this.echartsType = type;
      }
      const echartsType = this.echartsType;
      if (!this.loading) {
        this.myChart.hideLoading();
      }
      if (!this.myChart) return;
      const echartsData = this.echartsData;
      this.option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          top: 'bottom',
          data: echartsData.legend,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: [{
          type: 'category',
          boundrayGap: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              opacity: 0,
            },
          },
          data: echartsData.xData,
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#ddd',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              opacity: 0,
            },
          },
        }],
        series: [],
      };

      echartsData.yData.forEach((v, i) => {
        const obj = {
          name: echartsData.legend[i],
          symbol: 'none',
          type: echartsType,
          smooth: true,
          barWidth: (function barWidth() {
            return `${50 / echartsData.legend.length}%`;
          }()),
          itemStyle: {
            normal: {
              barBorderRadius: [10, 10, 0, 0],
              color: (function color() {
                const index = i % 3;
                const colorList = ['#007DFD', '#FF6E72', '#FFC751', '#16C2AF', '#6546B1', '#214E9F', '#6FE621', '4FCCFF', '#EF463C', '#785549'];
                return colorList[index];
              }()),
            },
          },
          lineStyle: {
            normal: {
              width: 3,
              color: (function color() {
                const index = i % 3;
                const colorList = ['#007DFD', '#FF6E72', '#FFC751', '#16C2AF', '#6546B1', '#214E9F', '#6FE621', '4FCCFF', '#EF463C', '#785549'];
                return colorList[index];
              }()),
            },
          },
          label: {
            normal: {
              show: false,
            },
          },
          data: v,
        };
        this.option.series.push(obj);
        // this.option.showLoading();
      });
    },
    /* 绘制饼图 */
    drawpie() {
      if (!this.myChart) return;
      this.echartsType = 'pie';
      const pieechartsData = [];
      const pie = [];
      // console.log(echartsData.legend);
      const echartsData = this.echartsData;
      echartsData.legend.forEach((v) => {
        pie.push(v);
      });
      echartsData.yData.forEach((v, i) => {
        let value = 0;
        v.forEach((vv) => {
          value += vv;
        });
        pieechartsData.push({
          name: pie[i],
          value,
        });
      });
      const series = {
        type: 'pie',
        radius: [0, '85%'],
        center: ['50%', '50%'],
        roseType: 'radius',
        color: ['#007DFD', '#FF6E72', '#FFC751', '#16C2AF', '#6546B1', '#214E9F', '#6FE621', '4FCCFF', '#EF463C', '#785549'],
        data: pieechartsData,
        label: {
          normal: {
            textStyle: {
              fontSize: 14,
            },
            formatter(param) {
              return `${param.name}:\n${Math.round(param.percent)}%`;
            },
          },
        },
        labelLine: {
          normal: {
            smooth: true,
            lineStyle: {
              width: 2,
            },
          },
        },
        itemStyle: {
          normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
      };
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          top: 'bottom',
          data: pie,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true,
        },
        series,
      };
      this.option = option;
    },
    /* 下拉框change事件 */
    dateTimeChange() {
      this.$emit('change', {
        type: 'date',
        value: {
          startTime: this.rangeTime[0],
          endTime: this.rangeTime[1],
          index: this.index,
        },
      });
    },
  },
  watch: {
    /* 监听图表变化 */
    echartsData: {
      handler() {
        if (this.echartsType === 'pie') {
          this.drawpie();
        } else {
          this.drawline();
        }
      },
      deep: true,
    },
    option: {
      handler() {
        this.myChart.clear();
        this.myChart.setOption(this.option);
      },
    },
    /* 加载lodding当为true显示lodding */
    service: {
      handler() {
        if (this.service.isLoading) {
          this.myChart.showLoading();
        } else {
          this.myChart.hideLoading();
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.karnel-commen {
  min-height: 400px;
/*       height: 30vw; */
  background-color: #fff;
  padding: 25px 35px;
  /*padding: 3% 2% 5%;*/
  border-radius: 8px;
  width: 100%;
  margin-bottom: 18px;
  box-sizing: border-box;
  border: 1px solid $borderColor;
  // box-shadow: 0 2px 30px 2px rgba(95,149,204,0.51);
  position: relative;
/*       .header {
    height: 56px;
  } */
  .title {
    font-weight: 600;
    margin-right:20px;
  }
  .new-timer {
    font-size: 12px;
    color: #3C4348;
  }
  .number {
    font-size: 16px;
    line-height: 33px;
    text-align:left;
    a{
        color: #3C4348;
        text-decoration: initial;
    }
  }
  .new-type {
    margin-bottom: 18px;
  }
  .add {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    p{
      padding-top: 20px;
      font-size: 24px;
      color: #007DFD;
    }
  }
}

.commen {
  height: 22vw;
  width: 100%;
}

.timer {
    width:203px;
  .el-input__icon+.el-input__inner{
    padding-right: 30px;
  }
  input{
    border:none;
    padding:0;
  }

}
.el-date-editor--daterange.el-input {
  width: 100%
}

</style>
