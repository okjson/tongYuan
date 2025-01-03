<template>
    <div class="fixedHeight">
        <div class="HeadScatter">
            <div class="scatter" ref="scatter"></div>
            <canvas id="canvas"></canvas>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import * as echarts from 'echarts';

export default {
    name: "Scatter",
    data() {
        return {
            //散点图数据
            Scatter: [],
            chart: '',
            flag: 0,
            nowTime: Date.now(),
            option: {
                visualMap: {
                    min: -120,
                    max: -80,
                    dimension: 1,
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    text: ['HIGH', 'LOW'],
                    calculable: true,
                    inRange: {
                        //color: ['#1a49f2', '#1a9cf2', '#1ae0f2', '#1af2f2', '#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',]
                        //color: ['#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',]
                          color: ['#0033FF', '#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF33', '#00FF00',
                                  '#33FF00', '#66FF00', '#99FF00', '#CCFF00', '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF3300', '#FF0000']
                    }
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                xAxis: [{
                    type: 'value',
                    interval: 3,
                    min: 2170, // 起始
                    max: 2200 // 终止
                }],
                yAxis: [{
                    type: 'value',
                    min: 0, // 起始
                    max: 100,
                }],
                series: [{
                    name: 'price-area',
                    type: 'scatter',
                    symbolSize: 1,
                     itemStyle: {
                         normal: {
                            borderWidth: 0.2,
                          }
                     },
                    data: []
                }]
            },
          //color: ['#1a49f2', '#1a9cf2', '#1ae0f2', '#1af2f2', '#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',],
          //color: ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00', '#CCFF00', '#99FF00', '#66FF00', '#33FF00',
          //        '#00FF00', '#00FF33', '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF', '#0066FF', '#0033FF'],

          color: ['#0033FF', '#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF33', '#00FF00',
                  '#33FF00', '#66FF00', '#99FF00', '#CCFF00', '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF3300', '#FF0000'],
            ctx: {},
        }
    },
    mounted() {
        this.chart = echarts.init(this.$refs['scatter']);
        this.createChart();
        this.setSize();
    },
    computed: {
        ...mapState({
            spectrum: state => state.data['spectrumdata'],
        })
    },
    watch: {
        spectrum() {
            this.editData();
        }
    },
    methods: {
        clear() {
            let scatter = document.querySelector('#canvas');
            let w = scatter.width;
            // let h = scatter.height;
            scatter.width = w;
            this.flag = 0;
        },
        drawDot(x, y, color) {
            let ctx = document.querySelector('#canvas').getContext("2d");
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(x, y, 5, 0, Math.PI * 2, true)
            ctx.fill()
            ctx.closePath();
        },
        editData() {
            this.flag += 5;
            if (this.flag == 180) {                //****************************************
                this.clear();
            }
            let myColor;
            this.spectrum.forEach((item, index) => {

                // console.log(item, '(**')
                let num = 0
                for (let i = -115; i <= -85; i += 1.5) {
                    if (item >= i && item <= i + 1.5) {
                        if(num > this.color.length){
                            num = this.color.length;
                        }
                        myColor = this.color[num];
                    }
                    num++;
                }
                if(index%4==0){

                    this.drawDot(index/4, this.flag, myColor)
                }
                //this.drawDot(index, this.flag, myColor)

            })
        },
        createChart() {
            this.chart.setOption(this.option);
        },
        setSize() {
            let canvas = document.querySelector('[data-zr-dom-id]');
            let scatter = document.querySelector('#canvas');
            console.log(canvas.clientWidth, '**', canvas.width)
            scatter.width = document.body.clientWidth  //* 0.8 - document.body.clientWidth * 0.4;   //********************
            scatter.height = canvas.clientHeight * 0.60;
        }
    }
}
</script>

<style scoped lang="less">
    .scatter {
        width: 945px;
        height: 300px;
        left:0px;
        position: relative;

        &:before {
            content: '时间 (s)';
            position: absolute;
            left: 70px;
            top: 30px;     //****************************
        }

        &:after {
            content: '频率(MHz)';
            position: absolute;
            right: 0px;
            bottom: 30px;
        }
    }

    #canvas {
        position: absolute;
        top: 50px;             //**************************
        left:9px;
        //width: 1800px;
        transform: rotateX(180deg);
        margin-left:86px;       //margin-left: 5.1%;
    }

    .HeadScatter {
        position: relative;

    }


</style>
