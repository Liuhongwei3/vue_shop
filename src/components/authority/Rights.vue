<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
	  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card>
	  <!--	表格数据	-->
	  <el-table
			  :data="rightsList"
			  style="width: 100%"
			  :border="true"
			  :stripe="true">
		<el-table-column type="index" label="#"></el-table-column>
		<el-table-column prop="authName" label="权限名称"></el-table-column>
		<el-table-column prop="path" label="路径"></el-table-column>
		<el-table-column prop="level" label="权限等级">
		  <template slot-scope="scope">
			<el-tag v-if="scope.row.level === '0'" type="success">一级</el-tag>
			<el-tag v-else-if="scope.row.level === '1'" type="warning">二级</el-tag>
			<el-tag v-else-if="scope.row.level === '2'" type="danger">三级</el-tag>
		  </template>
		</el-table-column>
	  </el-table>
	</el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
	data(){
      return{
		rightsList: [],
	  }
	},
	created() {
      this.getRightsList();
    },
    methods: {
      async getRightsList() {
        let {data: resData} = await this.$http.get('rights/list');
        if (resData.meta.status === 200) {
          this.rightsList = resData.data;
        } else {
          this.$message.error('获取权限列表数据失败~');
        }
      }
    },
  }
</script>

<style scoped>

</style>
