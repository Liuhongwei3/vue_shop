<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
	  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card class="box-card">
	  <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
	  <el-steps :space="200" :active="stepActiveIndex - 0" finish-status="success" align-center>
		<el-step title="基本信息"></el-step>
		<el-step title="商品参数"></el-step>
		<el-step title="商品属性"></el-step>
		<el-step title="商品图片"></el-step>
		<el-step title="商品内容"></el-step>
		<el-step title="完成"></el-step>
	  </el-steps>
	  <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsForm" label-width="100px" label-position="top">
		<el-tabs tab-position="left" v-model="stepActiveIndex" @tab-click="handleTabClick"
				 :before-leave="beforeTabLeave">
		  <el-tab-pane label="基本信息" name="0">
			<el-form-item label="商品名称" prop="goods_name">
			  <el-input v-model="addGoodsForm.goods_name"></el-input>
			</el-form-item>
			<el-form-item label="商品价格" prop="goods_price">
			  <el-input type="number" v-model="addGoodsForm.goods_price"></el-input>
			</el-form-item>
			<el-form-item label="商品重量" prop="goods_weight">
			  <el-input type="number" v-model="addGoodsForm.goods_weight"></el-input>
			</el-form-item>
			<el-form-item label="商品数量" prop="goods_number">
			  <el-input type="number" v-model="addGoodsForm.goods_number"></el-input>
			</el-form-item>
			<el-form-item label="商品分类" prop="goods_cat">
			  <el-cascader
					  v-model="addGoodsForm.goods_cat"
					  :options="parentCategoryList"
					  :props="cascaderProps"
					  expand-trigger="hover"
					  @change="handleParentCateChange"
					  clearable>
			  </el-cascader>
			</el-form-item>
		  </el-tab-pane>
		  <el-tab-pane label="商品参数" name="1">
			<el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
			  <el-checkbox-group v-model="item.attr_vals">
				<el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="item1.attr_id"
							 border></el-checkbox>
			  </el-checkbox-group>
			</el-form-item>
		  </el-tab-pane>
		  <el-tab-pane label="商品属性" name="2">
			<el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
			  <el-input type="text" v-model="item.attr_vals"></el-input>
			</el-form-item>
		  </el-tab-pane>
		  <el-tab-pane label="商品图片" name="3">
			<el-upload
					:action="uploadURL"
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					list-type="picture"
					:headers="headersObj"
					:on-success="handleUploadSuccess">
			  <el-button size="small" type="primary">点击上传</el-button>
			</el-upload>
		  </el-tab-pane>
		  <el-tab-pane label="商品内容" name="4">
			<quill-editor
					ref="myQuillEditor"
					v-model="addGoodsForm.goods_introduce"
			/>
			<el-button class="add-goods" type="primary" @click="addGoods">添加商品</el-button>
		  </el-tab-pane>
		</el-tabs>
	  </el-form>
	</el-card>
	<!--	图片预览	-->
	<el-dialog
			title="图片预览"
			:visible.sync="previewDialogVisible"
			width="50%">
	  <img :src="previewPath" align="previewImg" width="100%">
	</el-dialog>
  </div>
</template>

<script>
  export default {
    name: "GoodsAdd",
    data() {
      return {
        stepActiveIndex: '0',
        parentCategoryList: [],
        //	动态参数列表数据
        manyTableData: [],
        onlyTableData: [],
        uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
        previewPath: '',
        previewDialogVisible: false,
        //	upload picture headers (token)
        headersObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        addGoodsForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          pics: [],
          goods_introduce: '',
          attrs: []
        },
        addGoodsRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'},
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'},
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'},
          ],
          goods_cat: [
            {required: true, message: '请选择商品分类', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.getCategoryList();
    },
    computed: {
      cateId() {
        if (this.addGoodsForm.goods_cat.length === 3) {
          return this.addGoodsForm.goods_cat[2];
        }
        return null;
      }
    },
    methods: {
      async getCategoryList() {
        let {data: resData} = await this.$http.get('categories');
        if (resData.meta.status === 200) {
          this.parentCategoryList = resData.data;
        } else {
          this.$message.error('获取商品分类数据失败~');
        }
      },
      //	处理父级分类改变事件
      handleParentCateChange() {
        if (this.addGoodsForm.goods_cat.length !== 3) {
          this.addGoodsForm.goods_cat = [];
        }
      },
      async handleTabClick() {
        //	点击切换到商品参数 tab
        if (this.stepActiveIndex === '1') {
          let {data: resData} = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many'
            }
          });
          if (resData.meta.status === 200) {
            resData.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
            });
            this.manyTableData = resData.data;
          } else {
            this.$message.error('获取商品参数数据失败~');
          }
        } else if (this.stepActiveIndex === '2') {
          let {data: resData} = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          });
          if (resData.meta.status === 200) {
            // resData.data.forEach(item => {
            //   item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
            // });
            this.onlyTableData = resData.data;
          } else {
            this.$message.error('获取商品属性数据失败~');
          }
        }
      },
      //	处理切换 Tab 时检测是否选择了第三级分类
      beforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === "0" && this.addGoodsForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类 (第三级)~');
          return false;
        }
      },
      //	处理点击图片预览
      handlePreview(file) {
        this.previewPath = file.response.data.url;
        this.previewDialogVisible = true;
      },
      //	处理图片移除
      handleRemove(file) {
        let path = file.response.data.tem_path;
        let index = this.addGoodsForm.pics.findIndex(item => item.pic === path);
        this.addGoodsForm.pics.splice(index, 1);
      },
      //	处理图片上传成功
      handleUploadSuccess(res) {
        const picInfo = res.data.tmp_path;
        this.addGoodsForm.pics.push(picInfo);
      },
      addGoods() {
        this.$refs.addGoodsForm.validate(async valid => {
          if (!valid) return this.$message.error('请输入商品正确的相关信息~');
          //	解决级联选择器中商品分类 v-model 中只能为数组 不能为字符串
          const form = _.cloneDeep(this.addGoodsForm);
          form.goods_cat = form.goods_cat.join(',');
          //	处理动态参数
          this.manyTableData.forEach(item => {
            let newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            };
            this.addGoodsForm.attrs.push(newInfo);
          });
          //	处理静态属性
          this.onlyTableData.forEach(item => {
            let newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.addGoodsForm.attrs.push(newInfo);
          });
          form.attrs = this.addGoodsForm.attrs;
          let {data: resData} = await this.$http.post('goods/', form);
          if (resData.meta.status === 201) {
            this.$message.success('添加商品成功~');
            this.$router.push('/goods');
          } else {
            this.$message.error('添加商品失败~');
          }
        });
      }
    }
  }
</script>

<style scoped>
  .el-checkbox {
	margin: 0 10px 0 0 !important;
  }

  .add-goods {
	margin-top: 15px;
  }
</style>
