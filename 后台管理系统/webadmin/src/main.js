import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css


import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/assets/iconfont/iconfont.css'
import '@/permission' // permission control
import '@babel/polyfill'
import common from '@/utils/common'
import kk from 'keycloak-js'
import axios from "axios";
import { sessionStorageSet, sessionStorageGet } from '@/utils/storage'
import { setToken, getToken, removeToken } from "@/utils/auth";


setToken('6625516b9cd94d22bd8dc101701897c8')

// if (!getToken()) {
// const initOptions = {
//   url: process.env.VUE_APP_SSO_API,
//   realm: 'share',
//   clientId: 'door',
//   onLoad: 'login-required'
// }
// let keycloak = kk(initOptions)
// keycloak.init({ onLoad: initOptions.onLoad, promiseType: 'native' })
//   .then((authenticated) => {
//     console.log(keycloak)
//     console.log(authenticated)
//     axios({
//       method: "post",
//       url: process.env.VUE_APP_BASE_API + "/webadmin/user/ssoSignIn",
//       data: {
//         ssoToken: keycloak.token
//       }
//     }).then(row => {
//       if (row.data.code === 1) {
//         sessionStorageSet('id', row.data.data.id)
//         sessionStorageSet('name', row.data.data.name)
//         setToken(row.data.data.token)
//         // 获取权限树
//         axios({
//           method: "get",
//           url: process.env.VUE_APP_BASE_API + "/webadmin/permission/my/menuTree",
//           headers: {
//             Authorization: "token " + getToken()
//           }
//         }).then(row => {
//           let Data = row.data.data;
//           if (Data.length > 0) {
//             let route = Data[0].childs[0].entity.route
//             router.push({ path: route })
//           } else {
//             Vue.prototype.$message({
//               type: "error",
//               message: '您没有该平台功能相关权限，请联系系统管理员！'
//             });
//             setTimeout(() => {
//               let url = process.env.VUE_APP_SSOOUT_API;
//               sessionStorageSet("id", undefined);
//               sessionStorageSet("name", undefined);
//               removeToken();
//               window.open(url, "_self");
//             }, 1000)
//           }
//         }).catch(data => {
//           console.log(data);
//         });
//       } else {
//         Vue.prototype.$message({
//           type: "error",
//           message: row.data.msg
//         });
//         setTimeout(() => {
//           let url = process.env.VUE_APP_SSOOUT_API;
//           sessionStorageSet("id", undefined);
//           sessionStorageSet("name", undefined);
//           removeToken();
//           window.open(url, "_self");
//         }, 500)
//       }
//     }).catch(data => {
//       console.log(data);
//     });
//   }).catch(error => {
//     console.log('Authenticated Failed', error)
//   })
// }

Vue.use(ElementUI)

Vue.prototype.common = common
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
