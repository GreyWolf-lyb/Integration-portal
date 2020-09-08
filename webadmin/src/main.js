// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router' // 路由
import store from './store' // vuex
import './assets/style/common.css' // 公共样式
import * as filters from './components/filters' // 全局过滤器
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import echarts from 'echarts'
import api from './api/index';
import api1 from './api/getData';
import App from './App.vue'
import Keycloak from 'keycloak-js';


Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(api1);
Vue.use(api);
Vue.use(Antd)
Vue.use(ElementUI)
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

sessionStorage.setItem("token", "454a63787cc64851871f0be2875f567d")
sessionStorage.setItem("id", "admin")

// if (!sessionStorage.getItem('token')) {
//     const initOptions = {
//         url: 'http://106.116.160.122:9001/auth/',
//         // url: 'http://10.15.1.41:9001/auth/',
//         realm: 'share',
//         clientId: 'door',
//         onLoad: 'login-required'
//     }
//     let keycloak = Keycloak(initOptions)
//     keycloak.init({ onLoad: initOptions.onLoad, promiseType: 'native' })
//         .then((authenticated) => {
//             store.dispatch('user/login', keycloak.token).then(res => {
//                 this.$router.push({
//                     path: "/index"
//                 });
//             }).catch(err => {
//                 console.log(err, "报错")
//             })
//         }).catch(error => {
//             console.log('Authenticated Failed', error)
//         })
// }
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router, // 路由
    store, // 应用级数据（分组数据存贮）
    render: h => h(App)
})