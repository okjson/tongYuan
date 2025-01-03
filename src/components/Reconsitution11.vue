<template>
  <div class="ww">
    <div id="mychart" class="echart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  data() {
    return {
      point: [429, 610, 1389, 1521, 431, 609],
      pre1: "",
      pre2: "",
      act1: "",
      act2: "",
      flag: 0,
    };
  },
  computed: {
    ...mapState({
      yolo_result: (state) => state.data["yolo_result"],
      psk_result: (state) => state.data["c_img"],
      //实际值
      actual_status: (state) => state.data["actual_status"],
      //预测值
      predict_status: (state) => state.data["predict_status"],
      //实际值
      actual_value: (state) => state.data["actual_value"],
      //预测值
      predict_value: (state) => state.data["predict_value"],
    }),
  },
  mounted() {
    let arr = [];
    this.predict_status.forEach((item, index) => {
      if (item == 1) {
        arr.push(5);
      } else {
        arr.push(6);
      }
    });
    this.pre1 = arr;
    this.initEcharts();
  },
  watch: {
    actual_status() {
      this.flag = this.flag + 1;
      let arr1 = [];
      let arr2 = [];
      this.predict_status.forEach((item, index) => {
        if (item == 1) {
          arr1.push(5);
        } else {
          arr1.push(6);
        }
      });

      this.actual_status.forEach((item, index) => {
        if (item == 1) {
          arr2.push(5);
        } else {
          arr2.push(6);
        }
      });

      if (this.flag % 2 == 1) {
        this.pre2 = arr1;
        this.act1 = arr2;
        this.act2 = [];
      } else {
        this.pre1 = arr1;
        this.act2 = arr2;
        this.act1 = [];
      }
      this.initEcharts();
    },
  },
  methods: {
    initEcharts() {
      //初始化图表
      const myChart = echarts.init(document.getElementById("mychart"));
      // 基本柱状图
      const option = {
        legend: {
          selectedMode: false,
        },
        grid: {
          left: 100,
          right: 100,
          top: 50,
          bottom: 50,
        },
        xAxis: {
          type: "category",
          data: this.point,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            // 第一份数据的展示名称，此处为动态根据数据进行设置
            // 柱状图
            name: "预测值",
            type: "bar",
            bar: 0.2,
            // 使用上面配置的调色盘
            barWidth: "30%",
            label: {
              show: true,
              formatter: function (data) {
                return data.value == 6 ? "无信号" : "有信号";
              },
            },
            // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
            stack: "same",
            // 将处理好的第一份数据传入data
            // 数据格式为[1,2,3,4,....]
            data: this.pre1,
          },
          {
            // 第二份数据的展示名称，此处为动态根据数据进行设置
            name: "实际值",
            // 柱状图
            type: "bar",
            bar: 0.2,
            barWidth: "30%",
            label: {
              show: true,
              formatter: function (data) {
                return data.value == 6 ? "无信号" : "有信号";
              },
            },
            // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
            stack: "same",
            // 将处理好的第二份数据传入data
            data: this.act1,
          },
          {
            // 第二份数据的展示名称，此处为动态根据数据进行设置
            name: "预测值",
            // 柱状图
            type: "bar",
            bar: 0.2,
            barWidth: "30%",
            label: {
              show: true,
              formatter: function (data) {
                return data.value == 6 ? "无信号" : "有信号";
              },
            },
            // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
            stack: "hom",
            // 将处理好的第二份数据传入data
            data: this.pre2,
          },
          {
            // 第二份数据的展示名称，此处为动态根据数据进行设置
            name: "实际值",
            // 柱状图
            type: "bar",
            barWidth: "30%",
            bar: 0.2,
            label: {
              show: true,
              formatter: function (data) {
                return data.value == 6 ? "无信号" : "有信号";
              },
            },
            // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
            stack: "hom",
            // 将处理好的第二份数据传入data
            data: this.act2,
          },
        ],
      };
      myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>


<style>
.echart {
  width: 800px;
  height: 450px;
}
</style>

