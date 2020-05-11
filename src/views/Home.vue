<template>
  <el-container class="home-container">
	<el-header>
	  <div>
		<img src="../assets/img/tadm.png">
		<span>电商后台管理系统</span>
	  </div>
	  <el-button type="info" @click="logOut">退出</el-button>
	</el-header>
	<el-container>
	  <el-aside :width="isCollapsed?'64px':'200px'">
		<div class="toggle-button" @click="toggleMenu">|||</div>
		<el-menu
				class="el-menu-vertical-demo"
				background-color="#545c64"
				text-color="#fff"
				active-text-color="#409EFF"
				:unique-opened="true"
				:collapse="isCollapsed"
				:collapse-transition="false"
				:router="true"
				:default-active="activePath">
		  <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
			<template slot="title">
			  <i :class="iconsObj[item.id]"></i>
			  <span>{{item.authName}}</span>
			</template>
			<el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
						  @click="saveNavState('/' + subItem.path)">
			  <i class="el-icon-s-flag"></i>
			  <span>{{subItem.authName}}</span>
			</el-menu-item>
		  </el-submenu>
		</el-menu>
	  </el-aside>
	  <el-main>
		<router-view></router-view>
	  </el-main>
	</el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        menuList: [],
		iconsObj: {
          '125': 'el-icon-user-solid',
          '103': 'el-icon-s-tools',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-order',
          '145': 'el-icon-s-marketing',
		},
        isCollapsed: false,
		activePath: ''
      }
    },
    created() {
      this.getMenuList();
    },
    methods: {
      logOut() {
        window.sessionStorage.clear();
        this.$router.replace('/login');
      },
      async getMenuList() {
        let {data: resData} = await this.$http.get('menus');
        if (resData.meta.status === 200) {
          this.menuList = resData.data;
        } else {
          this.$message.error('获取菜单栏数据失败');
        }
      },
      toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
      },
      saveNavState(activePath) {
        window.sessionStorage.setItem('active', activePath);
        this.activePath = activePath;
      }
    },
  }
</script>

<style lang="less" scoped>
  .home-container {
	height: 100%;
  }

  .el-header {
	background-color: #373d41;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: white;
	font-size: 20px;

	img {
	  width: 50px;
	  height: 50px;
	}

	div {
	  display: flex;
	  align-items: center;
	}
  }

  .el-aside {
	background-color: #545c64;

	.toggle-button {
	  background-color: #4A5064;
	  font-size: 10px;
	  line-height: 24px;
	  color: white;
	  text-align: center;
	  letter-spacing: 0.2em;
	  cursor: pointer;
	}

	.el-menu {
	  border-right: none;
	}
  }

  .el-main {
	background-color: #eaedf1;
  }
</style>
