<template>
  <div class="login_container">
	<div class="login_box">
	  <div class="avatar">
		<img src="../assets/img/logo.png" alt="avatar">
	  </div>
	  <div class="login">
		<el-form ref="loginForm" :model="form" :rules="rules" label-width="80px">
		  <el-form-item label="用户名:" prop="username">
			<el-input v-model="form.username" prefix-icon="el-icon-user"></el-input>
		  </el-form-item>
		  <el-form-item label="密码:" prop="password">
			<el-input v-model="form.password" type="password" prefix-icon="el-icon-suitcase"></el-input>
		  </el-form-item>
		  <el-button type="primary" @click="submitForm">登 录</el-button>
		  <el-button type="info" @click="resetForm">重 置</el-button>
		</el-form>
	  </div>
	</div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        form: {
          username: 'admin',
          password: '123456'
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs.loginForm.validate(async valid => {
          if (valid) {
            let {data: resData} = await this.$http.post('/login', this.form);
            // console.log(resData);
            if (resData.meta.status === 200) {
              this.$message.success('登录成功，欢迎您！');
              window.sessionStorage.setItem('token', resData.data.token);
              await this.$router.push('/home');
            } else {
              this.$message.error('登录失败！请重新登录！');
            }
          } else {
            return false;
          }
        })
      },
      resetForm() {
        this.$refs.loginForm.resetFields();
      },
    },
  }
</script>

<style scoped>
  .login_container {
	background-color: beige;
	height: 100%;
	text-align: center;
  }

  .login_box {
	width: 600px;
	height: 400px;
	background-color: lightgray;
	position: absolute;
	left: 50%;
	top: 50%;
	margin: -200px 0 0 -300px;
	padding: 10px;
  }

  .avatar {
	width: 150px;
	height: 150px;
	position: relative;
	left: 50%;
	top: -15%;
	margin: 0 0 0 -75px;
  }

  img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: 1px solid #b43af0;
	box-shadow: 2px 2px 5px darkorange;
  }
</style>
