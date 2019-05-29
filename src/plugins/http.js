//插件模块
import axios from 'axios'
const MyHttpServer = {}
MyHttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // 4. 添加实例方法
  Vue.prototype.$http = axios

  //在请求发起之前 要设置头部--拦截器
  // 在请求发起之前 会先来到下面的回调函数
  axios.interceptors.request.use(function (config) {
    //判断它不等于登录时的标识--login
    if(config.url!=="login"){
      //获取token值
      const AUTH_TOKEN = localStorage.getItem("token");
      //设置请求头
      config.headers["Authorization"] = AUTH_TOKEN;
    }
  return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
  
}

export default MyHttpServer