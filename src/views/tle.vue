<template>
  <div>
    <div style="position: relative; height: 100%">
      <div id="h">
        <span style="font-size: 35px; color: white">请您选择区域</span>

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
          <!-- <button @click="openIndex" style="margin-left: 5px" v-if="buttonStop">
            查询
          </button> -->
          <div v-if="ys">
            <span>角度:{{ jiao_du }}</span>
            <span style="margin-left: 150px; font-size: 15px"
              >当前时间:{{ local_time }}</span
            >
          </div>
        </div>
      </div>
      <div id="cesiumContainer" style="height: 100%; width: 100%"></div>
      <div v-if="selectedSatellite" :style="popupStyle" class="satellite-popup">
        <p>卫星名称: {{ selectedSatellite.name }}</p>
        <p>实时经度: {{ currentLongitude }}</p>
        <p>实时纬度: {{ currentLatitude }}</p>
        <p>卫星方向：{{ jiao_du }}</p>
        <el-button :disabled="!ys" @click="openIndex">查询</el-button>
      </div>
      <!-- <div id="home">
        <Button @click="openHome">查看</Button>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as satellite from "satellite.js"; // 引入 satellite.js 库
import { mapState, mapMutations } from "vuex";
export default {
  name: "IndexMap",
  data() {
    return {
      viewer: null, // Cesium Viewer实例

      satelliteEntities: new Map(), // 存储卫星实体
      selectedSatellite: null, // 被选中的卫星
      popupPosition: { x: 0, y: 0 }, // 弹窗位置
      currentLongitude: null, // 实时经度
      currentLatitude: null, // 实时纬度
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
      satellites: (state) => state.satellites, // 映射 state.data 到 spectrumData
      jiao_du: (state) => state.data["jiaodu"],
      local_time: (state) => state.data["local_time"],
      quyu: (state) => state.data["quyu"],
    }),
    popupStyle() {
      return {
        position: "absolute",
        top: `${this.popupPosition.y}px`,
        left: `${this.popupPosition.x}px`,
        backgroundColor: "green",
        padding: "10px",
        border: "1px solid black",
        zIndex: 10,
        width: "300px", // 固定宽度为300px
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // 添加阴影效果
      };
    },
  },

  mounted() {
    // 初始化Cesium Viewer
    this.initCesium();
    // 加载卫星数据
    this.loadSatellites();
    // 设置点击事件监听器
    this.setClickHandler();
    // 假设接收到的后台数据
    const backendData = {
      satelliteId: 2,
      direction: 180,
    };
    // 调用方法高亮对应卫星轨迹并更新视角
    this.highlightSatellite(backendData.satelliteId, backendData.direction);
  },

  methods: {
    ...mapMutations(["updateData"]),
    initCesium() {
      // 配置Cesium资源路径
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Yzk5N2EzYi00NmVkLTQ5MzQtYWVjNy1iMWNlMzg1MjkwMTIiLCJpZCI6MTU3MDcxLCJpYXQiOjE2OTA1NTAwODl9.bnoI1f8fbtPOgGjyi0sXPY1iimv32O9XtRGGv4xCpKA";

      // 初始化Cesium Viewer
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: true, // 启用二三维视图切换控件
        timeline: true, // 启用时间线控件
        animation: true, // 启用动画控件
        navigationHelpButton: false,
        infoBox: false,
        scene3DOnly: false,
      });

      // 隐藏版权信息
      this.viewer._cesiumWidget._creditContainer.style.display = "none";

      let localDate = new Date();
      localDate.setHours(localDate.getHours() + 8);
      // 设置动画速度和时间范围
      const start = Cesium.JulianDate.fromDate(localDate);
      const stop = Cesium.JulianDate.addMinutes(
        start,
        120,
        new Cesium.JulianDate()
      );

      this.viewer.clock.startTime = start.clone();
      this.viewer.clock.stopTime = stop.clone();
      this.viewer.clock.currentTime = start.clone();
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      this.viewer.clock.multiplier = 30;
      this.viewer.clock.shouldAnimate = true; // 启动时间动画
      this.viewer.timeline.zoomTo(start, stop);

      this.viewer.clock.onTick.addEventListener(this.updateSatellitePositions);
    },

    loadSatellites() {
      this.satellites.forEach((satelliteData) => {
        const satrec = satellite.twoline2satrec(
          satelliteData.tleLine1,
          satelliteData.tleLine2
        );
        this.calculateAndDrawSatellitePath(satelliteData.id, satrec);
      });
    },

    openIndex() {
      this.$router.push("/index");
    },
    openStop() {
      this.buttonStop = true;
      const ws = new WebSocket("ws://192.168.14.151:8769");
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
    calculateAndDrawSatellitePath(id, satrec) {
      const positions = [];
      const now = Cesium.JulianDate.now();
      const adjustedTime = Cesium.JulianDate.addHours(
        now,
        8,
        new Cesium.JulianDate()
      );

      const positionProperty = new Cesium.SampledPositionProperty();

      for (let i = 0; i <= 120; i++) {
        const time = Cesium.JulianDate.addMinutes(
          adjustedTime,
          i,
          new Cesium.JulianDate()
        );
        const positionAndVelocity = satellite.propagate(
          satrec,
          Cesium.JulianDate.toDate(time)
        );
        const positionEci = positionAndVelocity.position;

        if (positionEci) {
          const gmst = satellite.gstime(Cesium.JulianDate.toDate(time));
          const positionGd = satellite.eciToGeodetic(positionEci, gmst);
          const longitude = Cesium.Math.toDegrees(positionGd.longitude);
          const latitude = Cesium.Math.toDegrees(positionGd.latitude);
          const height = positionGd.height * 1000;

          const cartesianPosition = Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            height
          );
          positions.push(cartesianPosition);
          positionProperty.addSample(time, cartesianPosition);
        }
      }

      const polyline = this.viewer.entities.add({
        id: `polyline_${id}`,
        polyline: {
          positions: positions,
          width: 2,
          material: Cesium.Color.fromCssColorString("#FFF").withAlpha(1),
        },
      });

      this.satelliteEntities.set(id, {
        satrec: satrec,
        positions: positions,
        marker: this.viewer.entities.add({
          id: `marker_${id}`,
          position: positionProperty,
          model: {
            uri: "./wx.gltf", // 模型文件路径
            minimumPixelSize: 64, // 模型的最小像素大小
          },
          orientation: new Cesium.VelocityOrientationProperty(positionProperty), // 自动根据位置计算方向
        }),
      });
    },

    updateSatellitePositions() {
      const now = this.viewer.clock.currentTime;
      this.satellites.forEach((satelliteData) => {
        const satEntity = this.satelliteEntities.get(satelliteData.id);
        if (!satEntity) return;
        const { satrec, marker } = satEntity;
        const positionAndVelocity = satellite.propagate(
          satrec,
          Cesium.JulianDate.toDate(now)
        );
        const positionEci = positionAndVelocity.position;
        if (positionEci) {
          const gmst = satellite.gstime(Cesium.JulianDate.toDate(now));
          const positionGd = satellite.eciToGeodetic(positionEci, gmst);
          const longitude = Cesium.Math.toDegrees(positionGd.longitude);
          const latitude = Cesium.Math.toDegrees(positionGd.latitude);
          const height = positionGd.height * 1000;

          const newPos = Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            height
          );
          marker.position = newPos;

          if (
            this.selectedSatellite &&
            this.selectedSatellite.id === satelliteData.id
          ) {
            this.updatePopupPosition(newPos);
            this.currentLongitude = longitude.toFixed(2);
            this.currentLatitude = latitude.toFixed(2);
          }
        }
      });
    },

    setClickHandler() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      handler.setInputAction((click) => {
        const pickedObject = this.viewer.scene.pick(click.position);
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.id &&
          pickedObject.id.id
        ) {
          const satelliteId = pickedObject.id.id.split("_")[1];
          const satEntity = this.satelliteEntities.get(Number(satelliteId));
          if (satEntity) {
            this.selectedSatellite = this.satellites.find(
              (sat) => sat.id === Number(satelliteId)
            );
            const position = satEntity.marker.position.getValue(
              this.viewer.clock.currentTime
            );
            this.updatePopupPosition(position);
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            this.currentLongitude = Cesium.Math.toDegrees(
              cartographic.longitude
            ).toFixed(2);
            this.currentLatitude = Cesium.Math.toDegrees(
              cartographic.latitude
            ).toFixed(2);
          }
        } else {
          this.selectedSatellite = null;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    updatePopupPosition(cartesian3) {
      const canvasPosition =
        this.viewer.scene.cartesianToCanvasCoordinates(cartesian3);
      if (Cesium.defined(canvasPosition)) {
        this.popupPosition = { x: canvasPosition.x, y: canvasPosition.y };
      }
    },

    highlightSatellite(satelliteId, direction) {
      const satEntity = this.satelliteEntities.get(satelliteId);
      satEntity.marker.model.color = Cesium.Color.RED;
      const polyline = this.viewer.entities.getById(`polyline_${satelliteId}`);

      if (polyline) {
        polyline.polyline.material =
          Cesium.Color.fromCssColorString("#0de1cd").withAlpha(1);
        polyline.polyline.width = 4;
      }
    },
  },
};
</script>

<style>
#cesiumContainer {
  height: 100%;
}

.satellite-popup {
  position: absolute;
  width: 300px;
  padding: 10px;
  border: 2px solid black;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #99b7ee !important;
  color: #fff;
}

.satellite-popup p {
  margin: 5px 0;
}
#home {
  padding: 7px 10px;
  position: fixed;
  top: 0px;
  right: 40px;
  width: 70px;
  background: #000;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  border-radius: 7px;
  z-index: 99;
}
#h {
  padding: 7px 10px;
  position: fixed;
  top: 0px;
  left: 10px;
  width: 650px;
  background: #000;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  border-radius: 7px;
  z-index: 99;
  color: white;
}
</style>
