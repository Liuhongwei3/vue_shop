<template>
  <div>
	<!--	面包屑导航条	-->
	<el-breadcrumb separator="/">
	  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
	  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
	</el-breadcrumb>
	<el-card class="box-card">
	  <el-row :gutter="20">
		<!--	搜索	-->
		<el-col :span="8">
		  <!--	非原生组件时使用 @keyup.xxx 需要添加 .native	-->
		  <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList"
					@keyup.enter.native="getUserList">
			<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
		  </el-input>
		</el-col>
		<!--	添加用户	-->
		<el-col :span="4">
		  <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
		</el-col>
	  </el-row>
	  <!--	表格数据	-->
	  <el-table
			  :data="userList"
			  style="width: 100%"
			  :border="true"
			  :stripe="true">
		<el-table-column type="index" label="#"></el-table-column>
		<el-table-column prop="username" label="姓名"></el-table-column>
		<el-table-column prop="email" label="邮箱"></el-table-column>
		<el-table-column prop="mobile" label="电话"></el-table-column>
		<el-table-column prop="role_name" label="角色"></el-table-column>
		<el-table-column label="状态">
		  <!--	作用域插槽	-->
		  <template slot-scope="scope">
			<!--	可以拿到该列的数据	-->
			<!--	{{scope.row}}	-->
			<el-switch
					v-model="scope.row.mg_state"
					active-color="#13ce66"
					inactive-color="#ff4949"
					@change="updateUserState(scope.row)">
			</el-switch>
		  </template>
		</el-table-column>
		<el-table-column label="操作">
		  <template slot-scope="scope">
			<el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
			<el-button type="danger" icon="el-icon-delete" circle @click="deleteUserById(scope.row.id)"></el-button>
			<el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
			  <el-button type="warning" icon="el-icon-setting" circle @click="setRole(scope.row)"></el-button>
			</el-tooltip>
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
	<!--	添加用户对话框	-->
	<el-dialog
			title="添加用户"
			:visible.sync="dialogVisible"
			width="50%"
			@close="resetAddForm">
	  <!--	显示内容  -->
	  <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef"
			   label-width="100px">
		<el-form-item label="用户名" prop="username">
		  <el-input type="text" v-model="addForm.username" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="密码:" prop="password">
		  <el-input v-model="addForm.password" type="password"></el-input>
		</el-form-item>
		<el-form-item label="邮箱:" prop="email">
		  <el-input v-model="addForm.email" type="text"></el-input>
		</el-form-item>
		<el-form-item label="电话:" prop="mobile">
		  <el-input v-model="addForm.mobile" type="text"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button @click="dialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitAddForm">添 加</el-button>
	  </span>
	</el-dialog>
	<!--	编辑用户对话框	-->
	<el-dialog
			title="修改用户"
			:visible.sync="editDialogVisible"
			width="50%"
			@close="resetEditForm">
	  <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
		<el-form-item label="用户名">
		  <el-input v-model="editForm.username" disabled></el-input>
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
		  <el-input v-model="editForm.email"></el-input>
		</el-form-item>
		<el-form-item label="电话" prop="mobile">
		  <el-input v-model="editForm.mobile"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button @click="editDialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="submitEditForm">确 定</el-button>
	  </span>
	</el-dialog>
	<!--	分配角色对话框	-->
	<el-dialog
			title="分配角色"
			:visible.sync="setRoleDialogVisible"
			width="50%"
			@close="resetRoleDialog">
	  <div>当前用户：{{allottedRoleInfo.username}}</div>
	  <div>当前角色：{{allottedRoleInfo.role_name}}</div>
	  <p>分配新角色：
		<el-select v-model="selectedRoleId" placeholder="请选择">
		  <el-option
				  v-for="item in rolesList"
				  :key="item.id"
				  :label="item.roleName"
				  :value="item.id">
		  </el-option>
		</el-select>
	  </p>
	  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateRoleInfo">确 定</el-button>
  </span>
	</el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Users",
    data() {
      var checkMobile = (rule, value, callback) => {
        if (/^1[0-9]{10}$/.test(value)) {
          return callback();
        }
        callback(new Error('请输入合法的电话号码'))
      };
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        userList: [],
        total: 0,
        dialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入电话号码', trigger: 'blur'},
            // {type: 'number', message: '电话号码只能为数字'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        },
        editDialogVisible: false,
        editForm: {},
        //	分配角色对话框显示与否
        setRoleDialogVisible: false,
        //	被分配角色的信息
        allottedRoleInfo: {},
        //	角色列表
        rolesList: [],
        //	选择的新角色 ID
        selectedRoleId: '',
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      async getUserList() {
        let {data: resData} = await this.$http.get('users', {
          params: this.queryInfo
        });
        if (resData.meta.status === 200) {
          this.userList = resData.data.users;
          this.total = resData.data.total;
        } else {
          this.$message.error('获取用户列表数据失败~');
        }
      },
      //	改变每页的 size
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },
      //	改变当前第几页
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },
      //	监听用户状态（switch 开关）
      async updateUserState(userInfo) {
        let {data: resData} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
        if (resData.meta.status === 200) {
          this.$message.success('更新用户状态成功~');
        } else {
          userInfo.mg_state = !userInfo.mg_state;
          this.$message.error('更新用户状态失败~');
        }
      },
      resetAddForm() {
        this.$refs.addFormRef.resetFields();
      },
      submitAddForm() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return;
          }
          let {data: resData} = await this.$http.post('users', this.addForm);
          if (resData.meta.status !== 201) {
            this.$message.error(resData.meta.msg);
            return;
          }
          this.$message.success('添加用户成功~');
          this.dialogVisible = false;
          this.getUserList();
        })
      },
      async showEditDialog(id) {
        let {data: resData} = await this.$http.get('users/' + id);
        if (resData.meta.status === 200) {
          this.editForm = resData.data;
        } else {
          this.$message.error('查询用户状态失败~');
        }
        this.editDialogVisible = true;
      },
      resetEditForm() {
        this.$refs.editFormRef.resetFields();
      },
      submitEditForm() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          let {data: resData} = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          });
          if (resData.meta.status === 200) {
            this.$message.success('更新用户信息成功~');
          } else {
            this.$message.error('更新用户信息失败~');
          }
          this.editDialogVisible = false;
          this.getUserList();
        });
      },
      deleteUserById(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {data: resData} = await this.$http.delete('users/' + id);
          if (resData.meta.status === 200) {
            this.$message.success('删除成功~');
            this.getUserList();
          } else {
            this.$message.error('删除失败！请稍后重新尝试此操作！');
            this.getUserList();
          }
        }).catch(() => {
          this.$message.error('已取消删除~')
        });
      },
      async setRole(role) {
        this.allottedRoleInfo = role;
        let {data: resData} = await this.$http.get('roles/');
        if (resData.meta.status === 200) {
          this.rolesList = resData.data;
        } else {
          this.$message.error('获取角色列表失败！');
        }
        this.setRoleDialogVisible = true;
      },
      async updateRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('请至少选择一项要分配的角色！')
        }
        let {data: resData} = await this.$http.get(`users/${this.allottedRoleInfo.id}/role`, {
          rid: this.selectedRoleId
        });
        if (resData.meta.status === 200) {
          this.$message.success('更新用户角色成功~');
          this.getUserList();
        } else {
          this.$message.error(resData.meta.msg || '更新用户角色失败！');
        }
        this.setRoleDialogVisible = false
      },
      //	分配角色关闭后应该清空相关信息
      resetRoleDialog() {
        this.selectedRoleId = '';
        this.allottedRoleInfo = {};
      }
    },
  }
</script>

<style scoped>
  .el-breadcrumb {
	margin-bottom: 15px;
  }
</style>
