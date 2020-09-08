/*
 * @Author: your name
 * @Date: 2020-06-20 19:31:19
 * @LastEditTime: 2020-07-01 15:11:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webadmin\src\api\user.js
 */ 
import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/webadmin/user/signIn',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/webadmin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/webadmin/user/signOut',
    method: 'get'
  })
}

export function mainMenuTree(params) {
  return request({
    url: '/webadmin/permission/MenuTree/findAll',
    method: 'get',
    params
  })
}

export function resetPassword(data) {
  return request({
    url: '/webadmin/user/updatePassword',
    method: 'put',
    data
  })
}

export function PermissionFindAll(params) {
  return request({
    url: 'webadmin/permission/my/menuTree',
    method: 'get',
    params
  })
}

export function myMenuTree(params) {
  return request({
    url: '/webadmin/permission/my/menuTree',
    method: 'get',
    params
  })
}

export function menus(params) {
  return request({
    url: '/webadmin/cms/category/menus',
    method: 'get',
    params
  })
}
