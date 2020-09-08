import axios from 'axios'
// 创建axios请求实例

const request = axios.create({
    baseURL: 'http://106.116.160.122:8081/', // 设置跨域代理接口统一的前置地址
    // baseURL: 'http://10.15.1.15/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'token ' + sessionStorage.getItem('token')
    }
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 只返回数据
    return response.data
}, function (error) {
    const status = error.response.status
    if (status >= 500) {
        alert('服务繁忙请稍后再试')
    } else if (status >= 400) {
        setTimeout(() => {
            window.location.reload();
        }, 2000)
        // alert(error.response.data.message)
    }
    // 对响应错误做点什么
    console.dir(error)
    return Promise.reject(error)
})

const get = (url, data) => request.get(url, {
    params: data
})
const post = (url, data) => request.post(url, data)
const DELETE = (url, data) => request.delete(url, data)
const head = (url, data) => request.head(url, data)
const options = (url, data) => request.options(url, data)
const put = (url, data) => request.put(url, data)
const patch = (url, data) => request.patch(url, data)

export {
    get,
    post,
    DELETE,
    head,
    options,
    put,
    patch
}