// 引入axios
import axios from 'axios'
// axios配置
Vue.prototype.$http = axios

// 配置默认axios参数
axios.defaults.baseURL = '/'
axios.defaults.timeout = 1000000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('token')
  if(token== null && router.currentRoute.path == '/login'){// 本地无token,不为登录 跳转至登录页面
    router.push('/login')
  }else{
    if(config.data==undefined){
      config.data = {
        "token":token
      }
    }else{
      Object.assign(config.data,{"token":token})
    }

  }
  return config
}, function (error) {
  iView.Message.error('请求失败')
  return Promise.reject(error)
})

// 返回结果拦截
axios.interceptors.response.use(function (response) {
  if(response.hasOwnProperty("data") && typeof response.data == "object"){
      if(response.data.code === 998){// 登录超时 跳转至登录页面
          iView.Message.error(response.data.msg)
          router.push('/login')
          return Promise.reject(response)
      }else if (response.data.code === 1000) {// 成功
        return Promise.resolve(response)
      }
  } else {
    return Promise.resolve(response)
  }

}, function (error) {
  // 请求取消 不弹出
  if(error.message != '0000'){
    iView.Message.error('请求失败')
  }

  // 请求错误时做些事
  return Promise.reject(error)
})

作者：愚坤
链接：https://juejin.im/post/5c488a3cf265da615705cc2a
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
