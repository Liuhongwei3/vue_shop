<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
	  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card class="box-card">
	  <el-row :gutter="20">
		<!--	搜索	-->
		<el-col :span="8">
		  <!--	非原生组件时使用 @keyup.xxx 需要添加 .native	-->
		  <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getGoodsList"
					@keyup.enter.native="getGoodsList">
			<!--	@click="getUserList"	-->
			<el-button slot="append" icon="el-icon-search"></el-button>
		  </el-input>
		</el-col>
		<!--	添加商品	-->
		<el-col :span="4">
		  <el-button type="primary" @click="toAddGoodsPage">添加商品</el-button>
		</el-col>
	  </el-row>
	  <!--	表格数据	-->
	  <el-table
			  :data="goodsList"
			  style="width: 100%;text-align: center"
			  :border="true"
			  :stripe="true">
		<el-table-column type="index" label="#"></el-table-column>
		<el-table-column prop="goods_name" label="商品名称"></el-table-column>
		<el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
		<el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
		<el-table-column label="添加时间" width="170px">
		  <template slot-scope="scope">
			{{scope.row.add_time | dateFormat}}
		  </template>
		</el-table-column>
		<el-table-column label="操作" width="180px">
		  <template slot-scope="scope">
			<el-button type="primary" icon="el-icon-edit">
			</el-button>
			<el-button type="danger" icon="el-icon-delete" @click="deleteGoodsById(scope.row.goods_id)">
			</el-button>
		  </template>
		</el-table-column>
	  </el-table>
	  <!--	分页	-->
	  <el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page="queryInfo.pagenum"
			  :page-sizes="[5, 10, 20, 30]"
			  :page-size="queryInfo.pagesize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="total"
			  background>
	  </el-pagination>
	</el-card>
  </div>
</template>

<script>
  export default {
    name: "GoodsList",
    data() {
      return {
        goodsList: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        total: 0
      }
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      async getGoodsList() {
        let {data: resData} = await this.$http.get('goods', {
          params: this.queryInfo
        });
        if (resData.meta.status === 200) {
          this.$message.success('获取商品列表数据成功~');
          this.goodsList = resData.data.goods;
          this.total = resData.data.total;
        } else {
          this.$message.error('获取商品列表数据失败~');
        }
      },
      //	改变每页的 size
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      //	改变当前第几页
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      deleteGoodsById(id){
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {data: resData} = await this.$http.delete('goods/' + id);
          if (resData.meta.status === 200) {
            this.$message.success('删除成功~');
            this.getGoodsList();
          } else {
            this.$message.error('删除失败！请稍后重新尝试此操作！');
            this.getGoodsList();
          }
        }).catch(() => {
          this.$message.error('已取消删除~')
        });
	  },
      toAddGoodsPage(){
        this.$router.push("/goods/add");
	  }
    },
  }
</script>

<style scoped>

</style>
