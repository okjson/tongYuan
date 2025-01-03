<template>
  <div>
    <div id="allmap"></div>
    <div id="result">
      <h2>频点信息展示</h2>
      <p v-for="(item, index) in point" :key="index">
        频点{{ index + 1 }}：{{
          point[index]
        }}
        &nbsp;&nbsp;&nbsp;&nbsp;预测值：{{
          predict_value[index]
        }}
        &nbsp;&nbsp;&nbsp;&nbsp;实际值：{{ actual_value[index] }}
      </p>
    </div>
    <!-- <div id="result">
      <h2>频点信息展示</h2>
      <div v-for="(item, index) in point" :key="index">
        <span
          >频点{{ index + 1 }}：{{ point[index] }} 预测值：{{
            predict_value[index]
          }}
          实际值：{{ actual_value[index] }}</span
        >
      </div>
    </div> -->
    <!-- <div id="result">
      <span style="font-size: 35px">请您选择区域</span>
      <span style="margin-left: 50px; font-size: 25px">当前时间:{{ t }}</span>
      <br />
      区域选择：<select
        name=""
        id="selectID"
        v-model="selectedMenu"
        @change="change($event)"
      >
        <option
          v-for="option in menuOptions"
          :value="option.value"
          :key="option.id"
          id="opt"
        >
          区域{{ option.text }}
        </option>
      </select>
      经度范围:
      <input id="lng" type="text" :value="selectedMenu[1]" /> 纬度范围:
      <input id="lat" type="text" :value="selectedMenu[2]" />
      <button
        @click="openStop"
        :class="{ grayedOut: buttonStop }"
        :disabled="buttonStop"
        v-if="selectedMenu !== ''"
      >
        产生
      </button>
      <button @click="openIndex" style="margin-left: 5px" v-if="buttonStop">
        查询
      </button>
    </div> -->
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "IndexMap",
  data() {
    return {
      point: [429, 610, 1389, 1521, 431, 609],
      buttonStop: false,
      index1: 0,
      index2: 1,
      inde: 0,
      selectedMenu: "",
      menuOptions: [
        // 下拉菜单的选项
        { value: ["1", "110°~120°", "30°~34°"], text: "1" },
        { value: ["2", "1°~120°", "3°~3°"], text: "2" },
        { value: ["3", "11°~120°", "0°~4°"], text: "3" },
        { value: ["4", "110°~120°", "30°~34°"], text: "4" },
        { value: ["5", "110°~120°", "30°~34°"], text: "5" },
        { value: ["6", "110°~120°", "30°~34°"], text: "6" },
        { value: ["7", "110°~120°", "30°~34°"], text: "7" },
      ],
    };
  },
  mounted() {
    let map = new BMapGL.Map("allmap");
    //map.centerAndZoom(new BMapGL.Point(116.331398,39.897445),11);
    map.centerAndZoom(new BMapGL.Point(86.37, 44.45), 5); //这个4是缩放比列
    map.enableScrollWheelZoom(true);
    let cityName = "乌鲁木齐市";
    let bdary = new BMapGL.Boundary();
    bdary.get(cityName, function (rs) {
      //获取行政区域
      map.clearOverlays(); //清除地图覆盖物
      //添加环形遮罩层
      let ply1 = new BMapGL.Polygon(
        [
          new BMapGL.Point(120, 30),
          new BMapGL.Point(110, 30),
          new BMapGL.Point(110, 34),
          new BMapGL.Point(120, 34),
        ],
        {
          strokeWeight: 4,
          fillColor: "#FFFFFF00",
          fillOpacity: "0.2",
          strokeColor: "#ff0000",
        }
      ); //建立多边形覆盖物
      map.addOverlay(ply1);
    });
    bdary.get(cityName, function (rs) {
      //获取行政区域
      //添加环形遮罩层
      let ply2 = new BMapGL.Polygon(
        [
          new BMapGL.Point(120, 20),
          new BMapGL.Point(110, 20),
          new BMapGL.Point(110, 34),
          new BMapGL.Point(120, 34),
        ],
        {
          strokeWeight: 4,
          fillColor: "#FFFFFF00",
          fillOpacity: "0.2",
          strokeColor: "#ff0000",
        }
      ); //建立多边形覆盖物
      map.addOverlay(ply2);
    });

    bdary.get(cityName, function (rs) {
      //获取行政区域
      //添加环形遮罩层
      let ply3 = new BMapGL.Polygon(
        [
          new BMapGL.Point(120, 30),
          new BMapGL.Point(110, 30),
          new BMapGL.Point(110, 24),
          new BMapGL.Point(120, 24),
        ],
        {
          strokeWeight: 4,
          fillColor: "#FFFFFF00",
          fillOpacity: "0.2",
          strokeColor: "#ff0000",
        }
      ); //建立多边形覆盖物
      map.addOverlay(ply3);
      ply1.addEventListener("click", () => {
        this.$router.push("/index");
      });
    });

    bdary.get(cityName, function (rs) {
      //获取行政区域
      //添加环形遮罩层
      let ply4 = new BMapGL.Polygon(
        [
          new BMapGL.Point(120, 30),
          new BMapGL.Point(80, 30),
          new BMapGL.Point(80, 34),
          new BMapGL.Point(120, 34),
        ],
        {
          strokeWeight: 4,
          fillColor: "#FFFFFF00",
          fillOpacity: "0.2",
          strokeColor: "#ff0000",
        }
      ); //建立多边形覆盖物
      map.addOverlay(ply4);
    });

    bdary.get(cityName, function (rs) {
      //获取行政区域
      //添加环形遮罩层
      let ply5 = new BMapGL.Polygon(
        [
          new BMapGL.Point(120, 13),
          new BMapGL.Point(110, 13),
          new BMapGL.Point(110, 34),
          new BMapGL.Point(120, 34),
        ],
        {
          strokeWeight: 4,
          fillColor: "#FFFFFF00",
          fillOpacity: "0.2",
          strokeColor: "#ff0000",
        }
      ); //建立多边形覆盖物
      map.addOverlay(ply5);
    });

    bdary.get(cityName, function (rs) {
      //获取行政区域
      //添加环形遮罩层
      let ply6 = new BMapGL.Polygon(
        [
          new BMapGL.Point(120, 30),
          new BMapGL.Point(90, 30),
          new BMapGL.Point(90, 34),
          new BMapGL.Point(120, 34),
        ],
        {
          strokeWeight: 4,
          fillColor: "#FFFFFF00",
          fillOpacity: "0.2",
          strokeColor: "#ff0000",
        }
      ); //建立多边形覆盖物
      map.addOverlay(ply6);
    });

    bdary.get(cityName, function (rs) {
      //获取行政区域
      //添加环形遮罩层
      let ply7 = new BMapGL.Polygon(
        [
          new BMapGL.Point(100, 30),
          new BMapGL.Point(110, 30),
          new BMapGL.Point(110, 34),
          new BMapGL.Point(100, 34),
        ],
        {
          strokeWeight: 4,
          fillColor: "#FFFFFF00",
          fillOpacity: "0.2",
          strokeColor: "#ff0000",
        }
      ); //建立多边形覆盖物
      map.addOverlay(ply7);
    });
  },
  // bdary.get(cityName, function (rs) {
  //   //获取行政区域
  //   map.clearOverlays(); //清除地图覆盖物
  //   // let ply = new BMapGL.Polygon(rs.boundaries[0], {
  //   //   strokeWeight: 2,
  //   //   strokeColor: "#00f",
  //   //   fillColor: "",
  //   // });
  //   // map.addOverlay(ply);
  //   // let ply2 = new BMapGL.Polygon(
  //   //   [
  //   //     new BMapGL.Point(50, 30),
  //   //     new BMapGL.Point(40, 30),
  //   //     new BMapGL.Point(40, 34),
  //   //     new BMapGL.Point(50, 34),
  //   //   ],
  //   //   {
  //   //     strokeWeight: 4,
  //   //     fillColor: "#FFFFFF00",
  //   //     fillOpacity: "0.2",
  //   //     strokeColor: "#00FF00",
  //   //   }
  //   // ); //建立多边形覆盖物
  //   // map.addOverlay(ply2);
  //   // let plyy = new BMapGL.Polygon(rs.boundaries[0], {
  //   //   strokeWeight: 2,
  //   //   strokeColor: "#00f",
  //   //   fillColor: "",
  //   // });
  //   // //绑定点击事件
  //   // map.addOverlay(plyy);
  // });
  computed: {
    ...mapState({
      actual_value: (state) => state.data["actual_value"],
      //预测值
      predict_value: (state) => state.data["predict_value"],
    }),
  },
};
</script>

<style scoped lang="less">
html,
body,
#allmap {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#result {
  padding: 7px 10px;
  position: fixed;
  top: 10px;
  left: 20px;
  width: 650px;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  border-radius: 7px;
  z-index: 99;
}

#result input {
  width: 130px;
  margin-right: 10px;
  height: 25px;
  border: 1px solid rgba(27, 142, 236, 0.5);
  border-radius: 5px;
}

#result button {
  border: 1px solid rgba(27, 142, 236, 0.5);
  border-radius: 5px;
  background: rgba(27, 142, 236, 0.5);
  color: #fff;
}

#place {
  padding: 7px 10px;
  position: fixed;
  top: 80px;
  left: 20px;
  width: 500px;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  border-radius: 7px;
  z-index: 99;
}

#place input {
  width: 130px;
  margin-right: 10px;
  height: 25px;
  border: 1px solid rgba(27, 142, 236, 0.5);
  border-radius: 5px;
}

#place button {
  border: 1px solid rgba(27, 142, 236, 0.5);
  border-radius: 5px;
  background: rgba(27, 142, 236, 0.5);
  color: #fff;
}
.grayedOut {
  background-color: #ccc !important; /* 灰色背景 */
  color: black;
}
</style>
