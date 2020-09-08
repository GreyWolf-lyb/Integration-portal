import request from '@/utils/request'

// 审批列表
export function getAppoveList(params) {
  return request({
    url: '/webadmin/operations/approval/findAll',
    method: 'get',
    params
  })
}
//获取详情
export function findById(params) {
  return request({
    url: '/webadmin/application/findById',
    method: 'get',
    params
  })
}
// 驳回/通过
export function updateAppove(data) {
  return request({
    url: '/webadmin/application/approval',
    method: 'post',
    data
  })
}