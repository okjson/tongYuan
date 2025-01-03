<template>
  <div class="PlanTabs fixedHeight">
    <el-tabs v-model="activeName" @tab-click="changeTabs">
      <el-tab-pane label="频谱态势预测" name="forecast" />
      <el-tab-pane label="异常检测" name="abnormal" />
      <el-tab-pane label="调制样式识别" name="planSphere" />
    </el-tabs>
    <!--  预测  -->
    <div class="forecast" v-show="activeName == 'forecast'">
      <div class="frequency">
        <el-button v-for="index in 6" :key="index" @click="canShow(index)"
          >信号{{ index }}</el-button
        >
      </div>
      <div class="myTitle">
        <p>信道占用</p>
      </div>
      <div class="topGroup" ref="topGroup">
        <div class="occupy">
          <!--                    <p class="line"/>-->
        </div>
        <div class="scrollView">
          <ul ref="occupy">
            <li
              v-for="(item, index) in actualValue"
              :key="index"
              v-show="(index + 1) % point == 0 || point == '-1'"
            >
              <p :class="setShow(item, index, 'blue')"></p>
            </li>
          </ul>
          <ul ref="idle" class="specialRed">
            <li
              v-for="(item, index) in predictValue"
              :key="index"
              v-show="(index + 1) % point == 0 || point == '-1'"
            >
              <p :class="setShow(item, index, 'blue')"></p>
            </li>
          </ul>
        </div>
      </div>
      <div class="myTitle bottomTitle">
        <p>信道空闲</p>
      </div>
      <div class="bottomGroup" ref="bottomGroup">
        <div class="occupy">
          <!--                    <p class="line"/>-->
        </div>
        <ul ref="occupy" class="specialBlue">
          <li
            v-for="(item, index) in actualValue"
            :key="index"
            v-show="(index + 1) % point == 0 || point == '-1'"
          >
            <p :class="setShow(item, index, 'red')"></p>
          </li>
        </ul>
        <ul ref="idle" class="specialCon">
          <li
            v-for="(item, index) in predictValue"
            :key="index"
            v-show="(index + 1) % point == 0 || point == '-1'"
          >
            <p :class="setShow(item, index, 'red')"></p>
          </li>
        </ul>
      </div>
    </div>

    <!--    异常检测    -->
    <div class="abnormal" v-show="activeName == 'abnormal'">
      <img :src="yolo_result" alt="" class="img" />
    </div>
    <!--    调制识别    -->
    <div class="planSphere" v-show="activeName == 'planSphere'">
      <img :src="psk_result" alt="" class="img" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "PlanTabs",
  data() {
    return {
      activeName: "forecast",
      //实际值
      actualValue: [],
      // 预测值
      predictValue: [],
      //频点
      point: "-1",
    };
  },
  computed: {
    ...mapState({
      yolo_result: (state) => state.data["yolo_result"],
      psk_result: (state) => state.data["c_img"],
      //实际值
      actual_value: (state) => state.data["actual_value"],
      //预测值
      predict_value: (state) => state.data["predict_value"],
    }),
  },
  watch: {
    actual_value() {
      this.Rendering();
      // this.scrollToEnd();
    },
  },
  mounted() {
    //this.scrollToEnd();
  },
  methods: {
    changeTabs() {
      console.log("测试");
    },
    scrollToEnd() {
      let occupy = this.$refs["topGroup"];
      let idle = this.$refs["bottomGroup"];
      occupy.scrollLeft = occupy.scrollWidth;
      idle.scrollLeft = idle.scrollWidth;
    },
    Rendering() {
      this.actualValue.push(...this.actual_value);
      this.predictValue.push(...this.predict_value);
    },
    canShow(index) {
      this.point = index;
    },
    setShow(item, index, type) {
      // console.log(item, '**')
      if (type == "blue") {
        if ((index >= 80 && item === 1) || index < 80) {
          console.log(item, index);
          return "blueTop";
        } else return "blueTop display";
      } else {
        if (index > 80 && item === 0) {
          return "redBottom";
        } else return "redBottom display";
      }
    },
  },
};
</script>

<style scoped lang="less">
.line {
  border-top: 1px solid #878484;
  height: 0;
  width: 100%;
  margin-top: 40px;
}

.PlanTabs {
  margin-top: 40px;
  height: 500px;
}

.forecast {
  .topGroup,
  .bottomGroup {
    position: relative;
    overflow-x: scroll;
    overflow-y: hidden;
    height: 130px;
    width: 35%;
    margin-left: 120px;
  }

  .myTitle {
    width: 100px;
    height: 50px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-top: 40px;
    line-height: 50px;
  }

  .occupy {
    display: flex;
    align-items: center;
  }

  ul {
    position: absolute;
    top: 30px;
    margin-left: 100px;
    width: 50%;
    display: flex;
    height: 87px;
    //overflow-x: scroll;
  }

  .blueTop,
  .redBottom {
    width: 20px; //预测点大小
    height: 20px;
    border-radius: 50%;
  }

  .blueTop {
    background: #2c806b;
  }

  .redBottom {
    background: #bf4449;
    margin-top: 10px;
  }
}

.display {
  background: transparent !important;
}

.bottomGroup {
  margin-top: 70px;
  overflow-x: scroll;
}

.img {
  width: 700px;
  height: 400px;
  display: block;
  margin: 0 auto;
}

.specialRed {
  margin-top: 40px;

  .blueTop {
    background: #bf4449;
  }
}

.specialBlue {
  .redBottom {
    background: #2c806b;
  }
}

.specialCon {
  .redBottom {
    margin-top: 50px;
  }
}

.myTitle {
  position: absolute;
}

.bottomTitle {
  margin-top: 100px !important;
}
.abnormal {
  width: 40%;
}
.planSphere {
  width: 40%;
}
</style>
