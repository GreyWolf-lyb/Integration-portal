import request from '@/utils/request'

export function findAllByOnline(params) {
    return request({
        url: '/webadmin/user/findAllByOnline',
        method: 'get',
        params
    })
}

export function updateUserStatus(data) {
    return request({
        url: '/webadmin/user/updateUserStatus',
        method: 'put',
        data
    })
}