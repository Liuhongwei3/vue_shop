<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
	  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card class="box-card">
	  <el-row :gutter="20">
		<!--	搜索	-->
		<el-col :span="8">
		  <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getOrderList"
					@keyup.enter.native="getOrderList">
			<el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
		  </el-input>
		</el-col>
	  </el-row>
	  <!--	表格数据	-->
	  <el-table
			  :data="orderList"
			  style="width: 100%"
			  :border="true"
			  :stripe="true">
		<el-table-column type="index" label="#"></el-table-column>
		<el-table-column prop="order_number" label="订单编号"></el-table-column>
		<el-table-column prop="order_price" label="订单价格"></el-table-column>
		<el-table-column label="是否付款">
		  <template slot-scope="scope">
			<el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
			<el-tag type="danger" v-else>未付款</el-tag>
		  </template>
		</el-table-column>
		<el-table-column prop="is_send" label="是否发货"></el-table-column>
		<el-table-column label="下单时间">
		  <template slot-scope="scope">
			{{scope.row.create_time | dateFormat}}
		  </template>
		</el-table-column>
		<el-table-column label="操作">
		  <template slot-scope="scope">
			<el-button type="primary" icon="el-icon-edit" circle @click="showBox"></el-button>
			<el-button type="success" icon="el-icon-location" circle
					   @click="showProgressBox"></el-button>
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
			  :total="total">
	  </el-pagination>
	</el-card>
	<!--	修改地址对话框	-->
	<el-dialog
			title="修改地址"
			:visible.sync="editAddressVisible"
			width="50%"
			@close="editAddressDialogClose">
	  <el-form :model="editAddressForm" status-icon :rules="editAddressFormRules" ref="editAddressFormRef"
			   label-width="100px">
		<el-form-item label="省市区/县" prop="address1">
		  <el-cascader :options="cityData" v-model="editAddressForm.address1"></el-cascader>
		</el-form-item>
		<el-form-item label="详细地址" prop="address2">
		  <el-input type="text" v-model="editAddressForm.address2" autocomplete="off"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button @click="editAddressVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitEditAddressForm">确 定</el-button>
	  </span>
	</el-dialog>
	<!--	展示物流进度		-->
	<el-dialog
			title="物流进度"
			:visible.sync="progressVisible"
			width="50%">
	  <el-timeline>
		<el-timeline-item
				v-for="(activity, index) in progressInfo"
				:key="index"
				:timestamp="activity.time">
		  {{activity.context}}
		</el-timeline-item>
	  </el-timeline>
	</el-dialog>
  </div>
</template>

<script>
  import cityData from "./citydata";

  export default {
    name: "Order",
    data() {
      return {
        orderList: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        editAddressVisible: false,
        progressVisible: false,
        editAddressForm: {
          address1: [],
          address2: ''
        },
        cityData,
        progressInfo: [],
        editAddressFormRules: {
          address1: [
            {required: true, message: '请输入省市区/县', trigger: 'blur'},
          ],
          address2: [
            {required: true, message: '请输入详细地址', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.getOrderList();
    },
    methods: {
      async getOrderList() {
        let {data: resData} = await this.$http.get('orders', {
          params: this.queryInfo
        });
        if (resData.meta.status === 200) {
          this.$message.success('获取订单列表数据成功~');
          this.orderList = resData.data.goods;
          this.total = resData.data.total;
        } else {
          this.$message.error('获取订单列表数据失败~');
        }
      },
      //	改变每页的 size
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      //	改变当前第几页
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      //	展示修改地址
      showBox() {
        this.editAddressVisible = true;
      },
      submitEditAddressForm() {

      },
      editAddressDialogClose() {
        this.$refs.editAddressFormRef.resetFields();
      },
      async showProgressBox() {
        let {data: resData} = await this.$http.get('/kuaidi/804909574412544580');
        if (resData.meta.status === 200) {
          this.progressInfo = resData.data;
        } else {
          this.$message.error('获取物流进度信息失败~');
        }
        this.progressVisible = true;
      }
    },
  }
</script>

<style scoped>
  .el-cascader {
	width: 100%;
  }
</style>
