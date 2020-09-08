import request from '@/utils/request'

export function findAll(params) {
  return request({
    url: '/webadmin/group/findAll',
    method: 'get',
    params
  })
}

export function deleteData(id) {
  return request({
    url: '/webadmin/group/delete',
    method: 'delete',
    params: { id }
  })
}

export function insert(data) {
  return request({
    url: '/webadmin/group/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/webadmin/group/update',
    method: 'put',
    data
  })
}

export function findById(params) {
  return request({
    url: '/webadmin/group/findById',
    method: 'get',
    params
  })
}
