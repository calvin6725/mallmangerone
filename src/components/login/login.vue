<template>
  <div class="login-wrap">
    <el-form 
     class="login-from"
    label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button 
       @click.prevent="handleLogin()"
         class="login-btn"
      type="primary">登录</el-button>
    </el-form>
      
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods:{
    async handleLogin(){

      const res=await this.$http.post(`login`,this.formdata)
      
        //es6 对象结构赋值
        const{
          data,
          meta:{msg,status}
        }=res.data
        if(status===200){
          // 保存token
          localStorage.setItem('token',data.token)
          //编程式导航
          this.$router.push({name:'home'})
           this.$message.success(msg);
        }else{
            this.$message.warning(msg);
        }
    }
  }
};
</script>

<style>
.login-wrap{
height: 100%;
background-color: #324152;
/* 弹性盒布局 */
display: flex;
justify-content: center;
align-items: center;
}
.login-wrap .login-from{
    width: 400px;
    background-color: #ffffff;
    border-radius: 5px;
    padding: 30px;
}
.login-wrap .login-btn{
    width: 100%;
}
</style>
