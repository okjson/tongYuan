<template>
  <div>
    <div id="allmap"></div>

    <!-- <div id="result">
      <span style="font-size: 35px">请您选择区域</span>
      <span style="margin-left: 50px; font-size: 15px"
        >当前时间:{{ local_time }}</span
      >
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
      <br />
      <div v-if="selectedMenu !== ''">
        <el-radio v-model="radio" label="1">压缩</el-radio>
        <el-radio v-model="radio" label="2">不压缩</el-radio>
        <button
          @click="openStop"
          :class="{ grayedOut: buttonStop }"
          :disabled="buttonStop"
          v-if="radio !== ''"
        >
          产生
        </button>
        <button @click="openIndex" style="margin-left: 5px" v-if="buttonStop">
          查询
        </button>
        <p>角度{{ jiao_du }}</p>
      </div>
    </div> -->
    <div id="result">
      <span style="font-size: 35px">请您选择区域</span>

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
      <br />
      <div v-if="selectedMenu !== ''">
        <el-radio v-model="radio" label="1">压缩</el-radio>
        <el-radio v-model="radio" label="2">不压缩</el-radio>
        <button
          @click="openStop"
          :class="{ grayedOut: buttonStop }"
          :disabled="buttonStop"
          v-if="radio !== ''"
        >
          产生
        </button>
        <button @click="openIndex" style="margin-left: 5px" v-if="buttonStop">
          查询
        </button>
        <div v-if="ys">
          <span>角度:{{ jiao_du }}</span>
          <span style="margin-left: 150px; font-size: 15px"
            >当前时间:{{ local_time }}</span
          >
        </div>
      </div>
    </div>
    <div id="tle">
      <Button @click="openTle">三维地图显示</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "IndexMap",
  data() {
    return {
      radio: "",
      buttonStop: false,
      index1: 0,
      index2: 1,
      inde: 0,
      selectedMenu: "",
      t: "",
      ys: false,
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
  computed: {
    ...mapState({
      local_time: (state) => state.data["local_time"],
      quyu: (state) => state.data["quyu"],
      jiao_du: (state) => state.data["jiaodu"],
    }),
  },
  methods: {
    openStop() {
      this.buttonStop = true;
      const ws = new WebSocket("ws://192.168.255.151:8769");
      let radios = this.radio;
      this.ys = true;
      ws.onopen = function () {
        console.log(radios);
        if (radios == 1) {
          ws.send("压缩数据");
        } else {
          ws.send("不压缩数据");
        }
      };
      ws.onmessage = (event) => {
        //console.log(data);
        let result = JSON.parse(event.data);
        //let result = event.data;
        // console.log(result, '信息')
        this.updateData(result);
      };
      // ws.onmessage = function (event) {
      //   // 处理Python返回的响应
      //   console.log(event.data);
      // };
      ws.onerror = () => {
        setTimeout(() => this.openStop(), 1000);
      };
      ws.onclose = function () {
        // 关闭WebSocket连接
        console.log("Connection closed");
      };
    },
    openIndex() {
      this.$router.push("/index");
    },
    openTle() {
      this.$router.push("/tle");
    },
    change(event) {
      var _this = this;
      this.inde = event.target.value[0]; //获取option对应的value值
      let map = new BMapGL.Map("allmap");
      //map.centerAndZoom(new BMapGL.Point(116.331398,39.897445),11);
      // map.centerAndZoom(new BMapGL.Point(118.777, 32.087), 5); //这个4是缩放比列 南京的
      map.centerAndZoom(new BMapGL.Point(86.37, 44.45), 5); //这个4是缩放比列
      map.enableScrollWheelZoom(true);
      let cityName = "乌鲁木齐市";
      let bdary = new BMapGL.Boundary();
      console.log(this.inde);
      if (this.inde == 1) {
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
      } else if (this.inde == 2) {
        bdary.get(cityName, function (rs) {
          //获取行政区域
          map.clearOverlays(); //清除地图覆盖物
          //添加环形遮罩层
          let ply1 = new BMapGL.Polygon(
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
          map.addOverlay(ply1);
        });
      } else if (this.inde == 3) {
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
          ply1.addEventListener("click", () => {
            this.$router.push("/index");
          });
        });
      } else if (this.inde == 4) {
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
      } else if (this.inde == 5) {
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
      } else if (this.inde == 6) {
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
      } else {
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
      }
    },
  },

  mounted() {
    let map = new BMapGL.Map("allmap");
    //map.centerAndZoom(new BMapGL.Point(116.331398,39.897445),11);
    map.centerAndZoom(new BMapGL.Point(86.37, 44.45), 5); //这个4是缩放比列
    map.enableScrollWheelZoom(true);
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
#tle {
  padding: 7px 10px;
  position: fixed;
  top: 20px;
  left: 250px;
  width: 90px;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  border-radius: 7px;
  z-index: 99;
}
.grayedOut {
  background-color: #ccc !important; /* 灰色背景 */
  color: black;
}
</style>
