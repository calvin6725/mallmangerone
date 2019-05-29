// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import MyHttpServer from '@/plugins/http'
import moment from 'moment'

//导入面包屑组件  MyBread 其实是组件选项所在的对象{template:'',data(){}}
import MyBread from '@/components/cuscom/myBread.vue'

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/react.css'

//使用vue插件
Vue.use(ElementUI);
Vue.use(MyHttpServer)


Vue.config.productionTip = false
//全局过滤器--处理日期
Vue.filter('fmtdata',(v)=>{
  return moment(v).format('YYYY-MM-DD')
})
//全局自定义组件
Vue.component(MyBread.name,MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
