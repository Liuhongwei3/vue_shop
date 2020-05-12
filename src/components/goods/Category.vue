<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
	  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card class="box-card">
	  <el-row :gutter="20">
		<!--	添加分类	-->
		<el-col :span="4">
		  <el-button type="primary" @click="showAddCategoryList">添加分类</el-button>
		</el-col>
	  </el-row>
	  <!--	表格数据	-->
	  <el-table
			  :data="categoryList"
			  style="width: 100%"
			  :border="true"
			  :stripe="true">
		<el-table-column type="index" label="#"></el-table-column>
		<el-table-column prop="cat_name" label="分类名称"></el-table-column>
		<el-table-column prop="email" label="是否有效">
		  <template slot-scope="scope">
			<i class="el-icon-success" style="color: #2cffc2"
			   v-if="scope.row.cat_deleted === false"></i>
			<i class="el-icon-error" style="color: red" v-else></i>
		  </template>
		</el-table-column>
		<el-table-column prop="mobile" label="排序">
		  <template slot-scope="scope">
			<el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
			<el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
			<el-tag type="warning" v-else-if="scope.row.cat_level === 2">三级</el-tag>
		  </template>
		</el-table-column>
		<el-table-column label="操作">
		  <template slot-scope="scope">
			<el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
			<el-button type="danger" icon="el-icon-delete" @click="deleteCateById(scope.row.cat_id)">删除</el-button>
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
	  <!--	添加分类对话框	-->
	  <el-dialog
			  title="添加分类"
			  :visible.sync="addCategoryDialogVisible"
			  width="50%"
			  @close="resetAddCategoryForm">
		<!--	显示内容  -->
		<el-form :model="addCategoryForm" status-icon :rules="addCategoryFormRules" ref="addCategoryFormRef"
				 label-width="100px">
		  <el-form-item label="分类名称" prop="cat_name">
			<el-input type="text" v-model="addCategoryForm.cat_name" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item label="父级分类:">
			<div class="block">
			  <el-cascader
					  v-model="selectedKeys"
					  :options="parentCategoryList"
					  :props="cascaderProps"
					  expand-trigger="hover"
					  @change="handleParentCateChange"
					  clearable></el-cascader>
			</div>
		  </el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
		<el-button @click="addCategoryDialogVisible = false">取 消</el-button>
		  		<el-button type="primary" @click="submitAddCateForm">添 加</el-button>
	  </span>
	  </el-dialog>
	  <!--	编辑分类对话框	-->
	  <el-dialog
			  title="修改分类"
			  :visible.sync="editDialogVisible"
			  width="50%"
			  @close="resetEditCateForm">
		<el-form :model="editCateForm" :rules="addCategoryFormRules" ref="editFormRef" label-width="100px">
		  <el-form-item label="分类名称" prop="cat_name">
			<el-input v-model="editCateForm.cat_name"></el-input>
		  </el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
		<el-button @click="editDialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitEditCateForm">确 定</el-button>
	  </span>
	  </el-dialog>
	</el-card>
  </div>
</template>

<script>
  export default {
    name: "Category",
    data() {
      return {
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        categoryList: [],
        parentCategoryList: [],
        total: 0,
        addCategoryDialogVisible: false,
        addCategoryForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
        addCategoryFormRules: {
          cat_name: [
            {required: true, message: '请输入类名', trigger: 'blur'},
            {min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur'}
          ],
        },
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedKeys: [],
        editCateForm: {},
        editDialogVisible: false,
      }
    },
    created() {
      this.getCategoryList()
    },
    methods: {
      async getCategoryList() {
        let {data: resData} = await this.$http.get('categories', {
          params: this.queryInfo
        });
        if (resData.meta.status === 200) {
          this.categoryList = resData.data.result;
          this.total = resData.data.total;
        } else {
          this.$message.error('获取商品分类数据失败~');
        }
      },
      async getParentCategoryList() {
        let {data: resData} = await this.$http.get('categories', {
          params: {
            type: 2
          }
        });
        if (resData.meta.status === 200) {
          this.parentCategoryList = resData.data;
        } else {
          this.$message.error('获取父级分类数据失败~');
        }
      },
      showAddCategoryList() {
        this.getParentCategoryList();
        this.addCategoryDialogVisible = true
      },
      //	改变每页的 size
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getCategoryList();
      },
      //	改变当前第几页
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getCategoryList();
      },
      //	处理父级分类改变事件
      handleParentCateChange() {
        if (this.selectedKeys.length > 0) {
          this.addCategoryForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
          this.addCategoryForm.cat_level = this.selectedKeys.length;
        } else {
          this.addCategoryForm.cat_pid = 0;
          this.addCategoryForm.cat_level = 0;
        }
      },
      submitAddCateForm() {
        this.$refs.addCategoryFormRef.validate(async valid => {
          if (!valid) {
            return;
          }
          let {data: resData} = await this.$http.post('categories', this.addCategoryForm);
          if (resData.meta.status !== 201) {
            this.$message.error(resData.meta.msg);
            return;
          }
          this.$message.success('添加分类成功~');
          this.addCategoryDialogVisible = false;
          this.getCategoryList();
        })
      },
      resetAddCategoryForm() {
        this.$refs.addCategoryFormRef.resetFields();
        this.selectedKeys = [];
        this.addCategoryForm.cat_pid = 0;
        this.addCategoryForm.cat_level = 0;
      },
      async showEditDialog(id) {
        let {data: resData} = await this.$http.get('categories/' + id);
        if (resData.meta.status === 200) {
          this.editCateForm = resData.data;
        } else {
          this.$message.error('查询分类信息失败~');
        }
        this.editDialogVisible = true;
      },
      resetEditCateForm() {
        this.$refs.editFormRef.resetFields();
      },
      submitEditCateForm() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          let {data: resData} = await this.$http.put('categories/' + this.editCateForm.cat_id, {
            cat_name: this.editCateForm.cat_name,
          });
          if (resData.meta.status === 200) {
            this.$message.success('更新分类信息成功~');
          } else {
            this.$message.error(resData.meta.msg || '更新分类信息失败~');
          }
          this.editDialogVisible = false;
          this.getCategoryList();
        });
      },
      deleteCateById(id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {data: resData} = await this.$http.delete('categories/' + id);
          if (resData.meta.status === 200) {
            this.$message.success('删除成功~');
            this.getCategoryList();
          } else {
            this.$message.error('删除失败！请稍后重新尝试此操作！');
            this.getCategoryList();
          }
        }).catch(() => {
          this.$message.error('已取消删除~')
        });
      }
    },
  }
</script>

<style scoped>
  .el-cascader {
	width: 100%;
  }
</style>
