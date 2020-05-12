<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
	  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card>
	  <el-row>
		<el-col :span="4">
		  <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
		</el-col>
	  </el-row>
	  <!--	表格数据	-->
	  <el-table
			  :data="rolesList"
			  style="width: 100%"
			  :border="true"
			  :stripe="true">
		<el-table-column type="expand">
		  <template slot-scope="scope">
			<el-row :class="['bottom',index1===0?'top':'','vertical-center']"
					v-for="(item1,index1) in scope.row.children"
					:key="item1.id">
			  <!--	一级	 -->
			  <el-col :span="5">
				<el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
				<i class="el-icon-caret-right"></i>
			  </el-col>
			  <el-col :span="19">
				<el-row :class="[index2===0?'':'top','vertical-center']" v-for="(item2,index2) in item1.children"
						:key="item2.id">
				  <!--	二级	 -->
				  <el-col :span="5">
					<el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item1.authName}}
					</el-tag>
					<i class="el-icon-caret-right"></i>
				  </el-col>
				  <!--	三级	 -->
				  <el-col :span="14">
					<el-tag type="warning" :class="[index3===0?'':'top']" v-for="(item3,index3) in item2.children"
							:key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
					  {{item1.authName}}
					</el-tag>
				  </el-col>
				</el-row>
			  </el-col>
			</el-row>
		  </template>
		</el-table-column>
		<el-table-column type="index" label="#"></el-table-column>
		<el-table-column prop="roleName" label="角色名称"></el-table-column>
		<el-table-column prop="roleDesc" label="角色描述"></el-table-column>
		<el-table-column label="操作">
		  <template slot-scope="scope">
			<el-button type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
			<el-button type="danger" icon="el-icon-delete" @click="deleteRoleById(scope.row.id)">删除</el-button>
			<el-button type="warning" icon="el-icon-setting" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
		  </template>
		</el-table-column>
	  </el-table>
	</el-card>
	<!--	添加角色对话框	-->
	<el-dialog
			title="添加角色"
			:visible.sync="addRoleDialogVisible"
			width="50%"
			@close="resetAddRoleForm">
	  <!--	显示内容  -->
	  <el-form :model="addRoleForm" status-icon :rules="addRoleFormRules" ref="addRoleFormRef"
			   label-width="100px">
		<el-form-item label="角色名称:" prop="roleName">
		  <el-input type="text" v-model="addRoleForm.roleName" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="角色描述:" prop="roleDesc">
		  <el-input type="text" v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button @click="addRoleDialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitAddRoleForm">添 加</el-button>
	  </span>
	</el-dialog>
	<!--	修改角色对话框	-->
	<el-dialog
			title="修改角色"
			:visible.sync="editRoleDialogVisible"
			width="50%"
			@close="resetEditRoleForm">
	  <!--	显示内容  -->
	  <el-form :model="editRoleForm" status-icon :rules="addRoleFormRules" ref="editRoleFormRef"
			   label-width="100px">
		<el-form-item label="角色名称:" prop="roleName">
		  <el-input type="text" v-model="editRoleForm.roleName" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="角色描述:" prop="roleDesc">
		  <el-input type="text" v-model="editRoleForm.roleDesc" autocomplete="off"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button @click="editRoleDialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitEditRoleForm">添 加</el-button>
	  </span>
	</el-dialog>
	<!--	分配权限 -- dialog	-->
	<el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="resetTreeInfo">
	  <el-tree
			  :data="rightsList"
			  :props="defaultProps"
			  show-checkbox
			  node-key="id"
			  default-expand-all
			  :default-checked-keys="defaultKeys"
			  ref="treeRef"></el-tree>
	  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
	</el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rolesList: [],
        setRightDialogVisible: false,
        rightsList: [],
        //	树节点数据展示
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        //	树节点默认选中的数据
        defaultKeys: [],
        //	即将分配权限的角色 ID
        roleId: '',
        addRoleDialogVisible: false,
        addRoleForm: {
          roleName: '',
          roleDesc: ''
        },
        editRoleForm: {},
        editRoleDialogVisible: false,
        addRoleFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.getRolesList();
    },
    methods: {
      async getRolesList() {
        let {data: resData} = await this.$http.get('roles');
        if (resData.meta.status === 200) {
          this.rolesList = resData.data;
        } else {
          this.$message.error('获取角色列表数据失败~');
        }
      },
      removeRightById(role, rightId) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {data: resData} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
          if (resData.meta.status === 200) {
            this.$message.success('删除该权限成功~');
            //	这样会导致页面表格重新渲染
            // this.getRolesList();
            role.children = resData.data;
          } else {
            this.$message.error('删除失败！请稍后重新尝试此操作！');
          }
        }).catch(() => {
          this.$message.error('已取消删除~')
        });
      },
      async showSetRightsDialog(role) {
        this.roleId = role.id;
        let {data: resData} = await this.$http.get('rights/tree');
        if (resData.meta.status === 200) {
          this.rightsList = resData.data;
        } else {
          this.$message.error('获取权限数据失败~');
        }
        this.getDefaultKeys(role, this.defaultKeys);
        this.setRightDialogVisible = true;
      },
      //	通过递归遍历获取到角色下所有三级权限 ID 并存在 defaultKeys
      getDefaultKeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id);
        }
        node.children.forEach(item => {
          this.getDefaultKeys(item, arr);
        })
      },
      resetTreeInfo() {
        this.defaultKeys = [];
      },
      //	分配权限
      async allotRights() {
        const checkedKeys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedNodes()
        ].join(',');
        let {data: resData} = await this.$http.post(`roles/${this.roleId}/rights`, {
          rids: checkedKeys
        });
        if (resData.meta.status === 200) {
          this.$message.success('分配权限成功~')
        } else {
          this.$message.error('分配权限失败~');
          return;
        }
        this.getRolesList();
        this.setRightDialogVisible = false;
      },
      deleteRoleById(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {data: resData} = await this.$http.delete('roles/' + id);
          if (resData.meta.status === 200) {
            this.$message.success('删除成功~');
            this.getRolesList();
          } else {
            this.$message.error('删除失败！请稍后重新尝试此操作！');
          }
        }).catch(() => {
          this.$message.error('已取消删除~')
        });
      },
      submitAddRoleForm() {
        this.$refs.addRoleFormRef.validate(async valid => {
          if (!valid) {
            return;
          }
          let {data: resData} = await this.$http.post('roles', this.addRoleForm);
          if (resData.meta.status !== 201) {
            this.$message.error(resData.meta.msg);
            return;
          }
          this.$message.success('添加角色成功~');
          this.addRoleDialogVisible = false;
          this.getRolesList();
        })
      },
      resetAddRoleForm() {
        this.$refs.addRoleFormRef.resetFields();
      },
      async showEditRoleDialog(id) {
        let {data: resData} = await this.$http.get('roles/' + id);
        if (resData.meta.status === 200) {
          this.editRoleForm = resData.data;
        } else {
          this.$message.error('查询角色信息失败~');
        }
        this.editRoleDialogVisible = true;
      },
      resetEditRoleForm() {
        this.$refs.editRoleFormRef.resetFields();
      },
      submitEditRoleForm() {
        this.$refs.editRoleFormRef.validate(async valid => {
          if (!valid) return;
          let {data: resData} = await this.$http.put('roles/' + this.editRoleForm.roleId, this.editRoleForm);
          if (resData.meta.status === 200) {
            this.$message.success('更新角色信息成功~');
          } else {
            this.$message.error(resData.meta.msg || '更新角色信息失败~');
          }
          this.editRoleDialogVisible = false;
          this.getRolesList();
        });
      }
    },
  }
</script>

<style scoped>
  .el-tag {
	margin: 10px;
  }

  .top {
	border-top: 1px solid #eee;
  }

  .bottom {
	border-bottom: 1px solid #eee;
  }

  .vertical-center {
	display: flex;
	align-items: center;
  }
</style>
