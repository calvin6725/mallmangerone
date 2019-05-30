import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'

import { MessageBox } from 'element-ui';
Vue.use(Router)

const router= new Router({
  routes: [{
      name:'login',
      path: '/login',
      component:Login
    },{
      name:'home',
      path: '/',
      component:Home,
      children:[
        {name:'users',
        path: 'users',
        component:Users,
      }, {
        name:'right',
        path: '/rights',
        component:Right
      },
      {
        name:'roles',
        path: '/roles',
        component:Role
      }
      ]
    }
   ]
})
//在路由的配置生效之前(路由的守卫) 统一判断token
//路由/导航/守卫->在路由生效之前 先来到守卫  beforeEach
router.beforeEach((to, from, next) => {
  // to:要去的路由配置
  // from :当前的路由配置
  //如果要去的是登录 -->next()
  //如要去的不是登录-->判断 token-->如果没有token-->login
  //如果有token--->next()


if(to.path==="/login"){
  //如果要去的是登录---next()
  next()
}else{
  //如果要去的不是登录
 
  const token=localStorage.getItem('token')
  if(!token){
    //如果没有token-->login
    //this.$router.push({name:"login"})  this是vm实例 但此时不是vue文件
    MessageBox.alert("请先登录")  //提示
    router.push({name:"login"})
    return
  }
   //如果有token--->next()
  next()
}

})

export default router


