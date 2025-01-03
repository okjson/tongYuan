<template>
    <div class="fixedHeight">
        <div class="tabTitle">
            <span>异常检测</span>
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
    name: "Interfere",
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
                    prop: 'bandwidth',
                },
                {
                    title: '类型',
                    prop: 'type',
                }
            ],
            tableData: [],
        }
    },
    computed: {
        ...mapState({
            //底噪起伏
            BottomNoise: state => state.data['flactuation'],
            //宽带干扰
            wide_interference: state => state.data['wide_interference'],
            //单音干扰
            singlEtone: state => state.data['singletone_interference'],
        })
    },
    watch: {
        BottomNoise() {
            this.ProcessingData();
        }
    },
    methods: {
        ProcessingData() {
            let arr = [];
            //if (Number(this.BottomNoise)) {
                //arr.push({
                    //bandwidth: this.BottomNoise,
                    //type: '底噪起伏',
                //})
            //}
            this.BottomNoise.forEach(item => {
                if (!Number(item)) return;
                arr.push({
                    bandwidth: item,
                    type: '底噪起伏',
                })
            })
            this.wide_interference.forEach(item => {
                if (!Number(item)) return;
                arr.push({
                    bandwidth: item,
                    type: '宽带干扰',
                })
            })
            this.singlEtone.forEach(item => {
                if (!Number(item)) return;
                arr.push({
                    bandwidth: item,
                    type: '单音干扰'
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