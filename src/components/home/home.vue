<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/logo.png" alt="黑马">
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a href @click.prevent="handleSignout()" class="loginout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏 -->
        <el-menu :router="true" :unique-opened="true">
          <!-- 1 -->
          <el-submenu :index="''+item1.order" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-s-promotion"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
              <i class="el-icon-location"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  // newVue之前自动触发
  beforeCreate() {
    // const token=localStorage.getItem('token')
    // if(!token){
    //     this.$router.push({name:"login"})
    // }
  },
  created() {
    this.getMenus();
  },
  methods: {
    //获取导航数据
    async getMenus() {
      const res = await this.$http.get(`menus`);
      this.menus = res.data.data;
    },
    handleSignout() {
      //1.清除token
      localStorage.clear();
      //2.提示
      this.$message.success("退出成功");
      //3.来的login组件
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
/*  */
.middle {
  text-align: center;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
