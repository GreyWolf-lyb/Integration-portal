/*
 * @Author: your name
 * @Date: 2020-06-23 14:10:36
 * @LastEditTime: 2020-06-26 15:42:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webadmin\src\api\omManger\user.js
 */
import request from '@/utils/request'

// 分页列表
export function getList(params) {
  return request({
    url: '/webadmin/application/findOpen',
    method: 'get',
    params
  })
}
//启用
export function Start(params) {
  return request({
    url: '/webadmin/application/start',
    method: 'get',
    params
  })
}
export function stop(params) {
  return request({
    url: '/webadmin/application/stop',
    method: 'get',
    params
  })
}


// 模型删除
export function deUser(id) {
  return request({
    url: '/webadmin/application/delete',
    method: 'delete',
    params: { id }
  })
}

// 模型新增
export function insert(data) {
  return request({
    url: '/webadmin/application/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/webadmin/application/update',
    method: 'put',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/webadmin/application/update',
    method: 'put',
    data
  })
}


export function roleList() {
  return request({
    url: '/webadmin/permission/role/findAll',
    method: 'get',
  })
}

export function setPasswd(params) {
  return request({
    url: '/webadmin/user/resetPassword',
    method: 'get',
    params
  })
}

