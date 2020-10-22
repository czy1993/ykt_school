<template>
  <div id="echart">
    <div class="echart_container">
      <h3>
        {{title}}
        <span></span>
      </h3>
      <div ref="echart" id="_echart"></div>
    </div>
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
// 引入提示框
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
import resize from "@/views/dashboard/mixins/resize";
import * as ecahrtData  from "./echart.js";
export default {
  mixins: [resize],
  props: {
    chartData: {
      type: Object
      //   required: true
    },
    type: String,
    dataType:String,
    title: String
  },
  data() {
    return {
      chart: null,
      typeList: {
        funnel: {
          callback: () => {
            funnel.series[0]["data"] = this.chartData;
            funnel.series[0]["max"] = this.chartData.reduce((acc, cur) => {
              return (acc += cur.value);
            }, 0);
            return funnel;
          }
        },
        pie: {
          callback: () => {
            pie.series[0]["data"] = this.chartData;
            return pie;
          }
        },
        bar: {
          callback: typebar => {
            for (let [index, item] of this.chartData.data.entries()) {
              typebar.series[index]["data"] = item;
            }
            typebar.xAxis[0].data = this.chartData.x;
            return typebar;
          }
        },
        line: {
          callback: () => {
            for (let [index, item] of this.chartData.data.entries()) {
              line.series[index]["data"] = item;
            }
            line.xAxis.data = this.chartData.x;
            return line;
          }
        }
      }
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.echart);
      this.chart.setOption(this.typeList[this.type].callback(ecahrtData[this.dataType]));
    }
  },
  watch: {
    chartData: {
      handler() {
        this.chart.setOption(this.typeList[this.type].callback(ecahrtData[this.dataType]));
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
#echart {
  width: 100%;
  height: 100%;
  .echart_container {
    width: 100%;
    height: 100%;
    h3 {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      span {
        color: #61acf1;
      }
    }
    #_echart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
