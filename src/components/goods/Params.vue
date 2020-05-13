<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
	  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card class="box-card">
	  <el-alert title="注意：只允许为第三级分类设置相关参数~" type="warning" :closable="false" show-icon></el-alert>
	  <el-row>
		<el-col class="cateOptions">
		  <span>选择商品分类：</span>
		  <el-cascader
				  v-model="selectedCateKeys"
				  :options="categoryList"
				  :props="cascaderProps"
				  expand-trigger="hover"
				  @change="handleChange"></el-cascader>
		</el-col>
	  </el-row>
	  <el-tabs v-model="activeName" @tab-click="handleTabClick">
		<el-tab-pane label="动态参数" name="many">
		  <el-button type="primary" :disabled="isDisabled" @click="addParamsDialogVisible = true">添加参数</el-button>
		  <el-table
				  :data="manyTableData"
				  style="width: 100%"
				  :border="true"
				  :stripe="true">
			<el-table-column type="expand">
			  <template slot-scope="scope">
				<el-tag v-for="(item,index) in scope.row.attr_vals" :key="scope.row.arr_id" closable
						@close="removeTag(index,scope.row)">{{item}}
				</el-tag>
				<el-input
						class="input-new-tag"
						v-if="scope.row.inputVisible"
						v-model="scope.row.inputValue"
						ref="saveTagInput"
						size="small"
						@keyup.enter.native="handleInputConfirm(scope.row)"
						@blur="handleInputConfirm(scope.row)"
				>
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
				</el-button>
			  </template>
			</el-table-column>
			<el-table-column type="index" label="#"></el-table-column>
			<el-table-column prop="attr_name" label="参数名称"></el-table-column>
			<el-table-column label="操作">
			  <template slot-scope="scope">
				<el-button type="primary" icon="el-icon-edit" @click="showEditParamsDialog(scope.row.attr_id)">编辑
				</el-button>
				<el-button type="danger" icon="el-icon-delete" @click="deleteParamsById(scope.row.attr_id)">删除
				</el-button>
			  </template>
			</el-table-column>
		  </el-table>
		</el-tab-pane>
		<el-tab-pane label="静态属性" name="only">
		  <el-button type="primary" :disabled="isDisabled" @click="addParamsDialogVisible = true">添加属性</el-button>
		  <el-table
				  :data="onlyTableData"
				  style="width: 100%"
				  :border="true"
				  :stripe="true">
			<el-table-column type="expand">
			  <template slot-scope="scope">
				<el-tag v-for="(item,index) in scope.row.attr_vals" :key="scope.row.arr_id" closable
						@close="removeTag(index,scope.row)">{{item}}
				</el-tag>
				<el-input
						class="input-new-tag"
						v-if="scope.row.inputVisible"
						v-model="scope.row.inputValue"
						ref="saveTagInput"
						size="small"
						@keyup.enter.native="handleInputConfirm(scope.row)"
						@blur="handleInputConfirm(scope.row)"
				>
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
				</el-button>
			  </template>
			</el-table-column>
			<el-table-column type="index" label="#"></el-table-column>
			<el-table-column prop="attr_name" label="属性名称"></el-table-column>
			<el-table-column label="操作">
			  <template slot-scope="scope">
				<el-button type="primary" icon="el-icon-edit" @click="showEditParamsDialog(scope.row.attr_id)">编辑
				</el-button>
				<el-button type="danger" icon="el-icon-delete" @click="deleteParamsById(scope.row.attr_id)">删除
				</el-button>
			  </template>
			</el-table-column>
		  </el-table>
		</el-tab-pane>
	  </el-tabs>
	</el-card>
	<!--	添加参数对话框	-->
	<el-dialog
			:title="'添加'+this.dialogTitle"
			:visible.sync="addParamsDialogVisible"
			width="50%"
			@close="addParamsDialogClose">
	  <el-form :model="addParamsForm" status-icon :rules="addParamsRules" ref="addParamsFormRef" label-width="100px"
			   class="demo-ruleForm">
		<el-form-item :label="dialogTitle" prop="attr_name">
		  <el-input type="text" v-model="addParamsForm.attr_name" autocomplete="off"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button @click="addParamsDialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitAddParamsForm">确 定</el-button>
	  </span>
	</el-dialog>
	<!--	修改参数对话框	-->
	<el-dialog
			:title="'修改'+this.dialogTitle"
			:visible.sync="editParamsDialogVisible"
			width="50%"
			@close="editParamsDialogClose">
	  <el-form :model="editParamsForm" status-icon :rules="addParamsRules" ref="editParamsFormRef" label-width="100px"
			   class="demo-ruleForm">
		<el-form-item :label="dialogTitle" prop="attr_name">
		  <el-input type="text" v-model="editParamsForm.attr_name" autocomplete="off"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button @click="editParamsDialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitEditParamsForm">确 定</el-button>
	  </span>
	</el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        categoryList: [],
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedCateKeys: [],
        activeName: 'many',
        manyTableData: [],
        onlyTableData: [],
        addParamsDialogVisible: false,
        addParamsForm: {
          attr_name: ''
        },
        addParamsRules: {
          attr_name: [
            {required: true, message: '请输入参数', trigger: 'blur'},
          ]
        },
        editParamsDialogVisible: false,
        editParamsForm: {},
        // inputVisible: false,
        // inputValue: ''
      }
    },
    created() {
      this.getCategoryList();
    },
    computed: {
      isDisabled() {
        return this.selectedCateKeys.length !== 3;
      },
      cateId() {
        return (this.selectedCateKeys.length === 3) ? this.selectedCateKeys[2] : null;
      },
      dialogTitle() {
        return this.activeName === "many" ? "动态参数" : "静态属性";
      }
    },
    methods: {
      async getCategoryList() {
        let {data: resData} = await this.$http.get('categories');
        if (resData.meta.status === 200) {
          this.categoryList = resData.data;
        } else {
          this.$message.error('获取商品分类数据失败~');
        }
      },
      async handleChange() {
        this.getParamsData();
      },
      handleTabClick() {
        this.getParamsData();
      },
      async getParamsData() {
        //	如果选中的不是三级分类
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = [];
          //	未选中三级参数时清空表格数据
          this.manyTableData = [];
          this.onlyTableData = [];
          return;
        }
        let {data: resData} = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {sel: this.activeName}
        });
        if (resData.meta.status === 200) {
          resData.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            //	为每一组的 tag 设置是否显示和 value
            item.inputVisible = false;
            item.inputValue = '';
          });
          if (this.activeName === "many") {
            this.manyTableData = resData.data;
          } else {
            this.onlyTableData = resData.data;
          }
        } else {
          this.$message.error('获取参数列表失败~');
        }
      },
      addParamsDialogClose() {
        this.$refs.addParamsFormRef.resetFields();
      },
      submitAddParamsForm() {
        this.$refs.addParamsFormRef.validate(async valid => {
          if (!valid) return;
          let {data: resData} = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          });
          if (resData.meta.status === 201) {
            this.$message.success('更新参数信息成功~');
          } else {
            this.$message.error(resData.meta.msg || '更新参数信息失败~');
          }
          this.addParamsDialogVisible = false;
          this.getParamsData();
        });
      },
      async showEditParamsDialog(attr_id) {
        let {data: resData} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {
            attr_sel: this.activeName
          }
        });
        if (resData.meta.status === 200) {
          this.editParamsForm = resData.data;
        } else {
          this.$message.error(resData.meta.msg || '更新参数信息失败~');
        }
        this.editParamsDialogVisible = true;
      },
      editParamsDialogClose() {
        this.$refs.editParamsFormRef.resetFields();
      },
      submitEditParamsForm() {
        this.$refs.editParamsFormRef.validate(async valid => {
          if (!valid) return;
          let {data: resData} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          });
          if (resData.meta.status === 200) {
            this.$message.success('更新参数信息成功~');
          } else {
            this.$message.error(resData.meta.msg || '更新参数信息失败~');
          }
          this.editParamsDialogVisible = false;
          this.getParamsData();
        });
      },
      deleteParamsById(attr_id) {
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {data: resData} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
          if (resData.meta.status === 200) {
            this.$message.success('删除成功~');
            this.getParamsData();
          } else {
            this.$message.error('删除失败！请稍后重新尝试此操作！');
          }
        }).catch(() => {
          this.$message.error('已取消删除~')
        });
      },
      showInput(row) {
        row.inputVisible = true;
        //	页面重新渲染后执行此处
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = '';
          row.inputVisible = false;
          return;
        }
        row.attr_vals.push(row.inputValue.trim().valueOf());
        this.saveAttrs(row);
      },
      async removeTag(index, row) {
        row.attr_vals.splice(index, 1);
        this.saveAttrs(row);
      },
      async saveAttrs(row) {
        let {data: resData} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        });
        if (resData.meta.status === 200) {
          this.$message.success('更新参数信息成功~');
        } else {
          this.$message.error('更新参数信息失败~');
        }
        row.inputValue = '';
        row.inputVisible = false;
      }
    }
  }
</script>

<style scoped>
  .cateOptions {
	margin: 15px;
  }

  .el-tag {
	margin: 10px;
  }

  .input-new-tag {
	width: 150px;
  }
</style>
