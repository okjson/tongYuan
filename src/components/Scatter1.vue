<template>
  <div class="fixedHeight">
    <div class="HeadScatter">
      <div class="scatter" ref="scatter"></div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as echarts from "echarts";

export default {
  name: "Scatter",
  data() {
    return {
      //散点图数据
      Scatter: [],
      chart: "",
      flag: 0,
      nowTime: Date.now(),
      option: {
        //旁边的图例
        visualMap: {
          // type: "piecewise",
          // showLabel: true,
          // inverse: true,

          dimension: 1,
          orient: "vertical",
          top: "center",
          pieces: [
            {
              value: 1,
              label: "无信号",
              color: "#FF0000",
            },
            // {
            //   value: 2,
            //   label: "有信号",
            //   color: "#00CCFF",
            // },
          ],
        },
        // visualMap: {
        //   min: -120,
        //   max: -80,
        //   dimension: 1,
        //   orient: "vertical",
        //   right: 10,
        //   top: "center",
        //   text: ["HIGH", "LOW"],
        //   calculable: true,
        //   inRange: {
        //     //color: ['#1a49f2', '#1a9cf2', '#1ae0f2', '#1af2f2', '#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',]
        //     //color: ['#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',]
        //     color: [
        //       "#0033FF",
        //       "#0066FF",
        //       "#0099FF",
        //       "#00CCFF",
        //       "#00FFFF",
        //       "#00FFCC",
        //       "#00FF99",
        //       "#00FF66",
        //       "#00FF33",
        //       "#00FF00",
        //       "#33FF00",
        //       "#66FF00",
        //       "#99FF00",
        //       "#CCFF00",
        //       "#FFFF00",
        //       "#FFCC00",
        //       "#FF9900",
        //       "#FF6600",
        //       "#FF3300",
        //       "#FF0000",
        //     ],
        //   },
        // },
        tooltip: {
          trigger: "item", //提示组件触发类型
          axisPointer: {
            type: "cross", //指示器类型
          },
        },
        xAxis: [
          {
            type: "value",
            interval: 3,
            min: 2170, // 起始
            max: 2200, // 终止
          },
        ],
        yAxis: [
          {
            type: "value",
            //min: 0, // 起始
            //max: 100,
          },
        ],
        series: [
          {
            name: "price-area",
            type: "scatter", //散点图
            symbolSize: 1,
            itemStyle: {
              normal: {
                borderWidth: 0.2,
              },
            },
            data: [],
          },
        ],
      },
      ctx: {},
    };
  },
  mounted() {
    this.chart = echarts.init(this.$refs["scatter"]);
    this.createChart();
    this.setSize();
  },
  computed: {
    ...mapState({
      exists_signal: (state) => state.data["exists_signal"],
      Not_exists_signal: (state) => state.data["Not_exists_signal"],
    }),
  },
  watch: {
    // spectrum() {
    //   this.editData();
    // },
    exists_signal() {
      this.editData();
    },
  },
  methods: {
    clear() {
      let scatter = document.querySelector("#canvas");
      let w = scatter.width;
      scatter.width = w;
      this.flag = 0;
    },
    drawDot(x, y, color) {
      let ctx = document.querySelector("#canvas").getContext("2d");
      ctx.beginPath();
      ctx.fillStyle = color; //填充颜色
      ctx.fillRect(x, 0, y, 170);
      ctx.closePath(); //创建从当前点回到起始点的路径
    },
    editData() {
      this.clear();

      this.exists_signal.forEach((item) => {
        let x1 = item[0];
        let x2 = item[1];
        let x = ((x1 - 2170) / 30) * 756;
        let y = ((x2 - x1) / 30) * 756;
        this.drawDot(x, y, "#FF0000");
      });
      this.Not_exists_signal.forEach((item) => {
        let y1 = item[0];
        let y2 = item[1];
        let x = ((y1 - 2170) / 30) * 756;
        let y = ((y2 - y1) / 30) * 756;
        this.drawDot(x, y, "#00000000");
      });
    },
    //配置图标实列的配置项和数据
    createChart() {
      this.chart.setOption(this.option);
    },
    setSize() {
      let canvas = document.querySelector("[data-zr-dom-id]");
      let scatter = document.querySelector("#canvas");
      console.log(canvas.clientWidth, "**", canvas.width);
      scatter.width = document.body.clientWidth; //* 0.8 - document.body.clientWidth * 0.4;   //********************
      scatter.height = canvas.clientHeight * 0.6;
    },
  },
};
</script>

<style scoped lang="less">
.scatter {
  width: 945px;
  height: 300px;
  left: 0px;
  position: relative;

  &:before {
    //content: "时间 (s)";
    position: absolute;
    left: 70px;
    top: 30px; //****************************
  }

  &:after {
    content: "频率(MHz)";
    position: absolute;
    right: 0px;
    bottom: 30px;
  }
}

#canvas {
  position: absolute;
  top: 50px; //**************************
  left: 9px;
  //width: 1800px;
  transform: rotateX(180deg);
  margin-left: 86px; //margin-left: 5.1%;
}

.HeadScatter {
  position: relative;
}
</style>
