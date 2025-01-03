<template>
    <div class="fixedHeight">
        <div class="tabTitle">
            <span>参数识别</span>
        </div>
        <el-table
                :data="tableData"
                height="250"
                border
                class="tabData"
        >
            <el-table-column v-for="(item,index) in tabTitle" :key="index"
                             :type="index?'':'index'"
                             :label="item.title"
                             :width="item.width||'auto'"
                             :prop="item.prop">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: "SignalAnalysis",
    data() {
        return {
            tabTitle: [
                {
                    title: '序号',
                    prop: '',
                    width: 80,
                },
                {
                    title: '中心频率/MHz',
                    prop: 'centerFrequency',
                },
                {
                    title: '带宽/kHz',
                    prop: 'bandwidth',
                },
                {
                    title: '功率/dBm',
                    prop: 'peakPower',
                },
                {
                    title: '符号速率',
                    prop: 'symbolrates',
                },
                {
                    title: '调制类型',
                    prop: 'constellations',
                }
            ],
            tableData: [],
        }
    },
    computed: {
        ...mapState({
            bandwidth: state => state.data['bandwidth'],
            symbolrates: state => state.data['symbolrates'],
            centerFrequency: state => state.data['centerfrequency'],
            peakPower: state => state.data['peakpower'],
            constellations: state => state.data['constellations'],
        })
    },
    watch: {
        bandwidth() {
            this.ProcessingData();
        }
    },
    methods: {
        ProcessingData() {
            let arr = [];
            this.bandwidth.forEach((item, index) => {
                arr.push({
                    bandwidth: item,
                    centerFrequency: this.centerFrequency[index],
                    peakPower: this.peakPower[index],
                    symbolrates: this.symbolrates[index],
                    constellations: this.constellations[index],
                })
            })
            this.tableData = arr;
        }
    }
}
</script>

<style scoped lang="less">
.tabData {
  width: 100%;         //***********************************
}
.tabTitle{              //************************************
  height:20px;
  line-height: 20px;
}
span {                  //************************************
  font-size: 18px;
  font-weight: bold;
  margin-left: 20px;
}
</style>