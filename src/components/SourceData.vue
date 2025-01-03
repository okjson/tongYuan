<template>
  <div id="SourceData" v-loading="load">
    <div class="SourceData" ref="source"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";

export default {
  name: "SourceData",
  data() {
    return {
      myChart: {},
      date: [122],
      myData: [],
      option: {},
      flag: 0,
      load: true,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      spectrum: (state) => state.data["spectrumdata"],
    }),
  },
  watch: {
    spectrum() {
      this.draw();
      if (this.load) this.load = false;
    },
  },
  methods: {
    init() {
      this.myChart = echarts.init(this.$refs.source);
    },
    draw(flag) {
      this.myData = this.spectrum;
      this.date = [];
      this.myData.forEach((item, index) => {
        this.date.push(2170 + 0.01 * index);
      });
      this.option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        // title: {
        //     left: 'center',
        //     text: '图标名称',
        // },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.date,
          },
        ],
        yAxis: {
          type: "value",
          boundaryGap: ["20%", "20%"],

          min: -120, // 起始
          max: -90, // 终
        },
        // dataZoom: [{
        //     type: 'inside',
        //     start: 0,
        //     end: 10
        // }, {
        //     start: 0,
        //     end: 10
        // }],
        series: [
          {
            name: "坐标",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "rgb(255, 70, 131)",
            },
            data: this.myData,
          },
        ],
      };
      this.myChart.setOption(this.option);
    },
  },
};
</script>

<style scoped lang="less">
.SourceData {
  width: 800px;
  height: 300px;

  &:before {
    content: "谱密度 (dBm)";
    position: absolute;
    left: 70px;
    top: 20px;
  }

  &:after {
    content: "频率 (MHz)";
    position: absolute;
    right: 5px;
    bottom: 25px;
  }
}
</style>
