<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
	  <el-breadcrumb-item>数据报表</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card class="box-card">
	  <div id="main" style="width: 750px;height:500px;"></div>
	</el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'

  export default {
    name: "Report",
    data() {
      return {
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    created() {

    },
    async mounted() {
      const myChart = echarts.init(document.getElementById('main'));
      let {data: resData} = await this.$http.get('reports/type/1');
      if (resData.meta.status === 200) {
        this.$message.success('获取报表数据成功~');
        const result = _.merge(resData.data, this.options)
        myChart.setOption(result);
      } else {
        this.$message.error('获取报表数据失败~');
      }
    }
  }
</script>

<style scoped>

</style>
