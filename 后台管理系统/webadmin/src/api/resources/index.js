import request from '@/utils/request'

// 文件夹管理接口
// 文件管理列表
export function fileManagementList(params) {
    return request({
        url: '/webadmin/cms/resourceFolder/findAll',
        method: 'get',
        params
    })
}
// 查看文件夹详情
export function fileDetails(params) {
    return request({
        url: '/webadmin/cms/resourceFolder/findById',
        method: 'get',
        params
    })
}
// 修改文件夹名称
export function fileNameEdit(params) {
    return request({
        url: '/webadmin/cms/resourceFolder/update',
        method: 'put',
        data: params
    })
}
// 删除文件夹
export function deleteFile(params) {
    return request({
        url: '/webadmin/cms/resourceFolder/delete',
        method: 'DELETE',
        params
    })
}
// 添加文件夹
export function addFile(params) {
    return request({
        url: '/webadmin/cms/resourceFolder/insert',
        method: 'post',
        data: params
    })
}

// 资源库
export function fileFesourceLibList(params) {
    return request({
        url: '/webadmin/cms/resourceLib/findAll',
        method: 'get',
        params
    })
}
export function fileFesourceDelete(params) {
    return request({
        url: '/webadmin/cms/resourceLib/delete',
        method: 'DELETE',
        params
    })
}
export function fileFesourceInsert(params) {
    return request({
        url: '/webadmin/cms/resourceLib/insert',
        method: 'post',
        data: params
    })
}

// 栏目管理接口
// 栏目列表
export function categoryList(params) {
    return request({
        url: '/webadmin/cms/category/findAll',
        method: 'get',
        params
    })
}
// 栏目详情
export function categoryDetails(params) {
    return request({
        url: '/webadmin/cms/category/findById',
        method: 'get',
        params
    })
}
// 编辑栏目
export function categoryEdit(params) {
    return request({
        url: '/webadmin/cms/category/update',
        method: 'put',
        data: params
    })
}
// 添加栏目
export function categoryAdd(params) {
    return request({
        url: '/webadmin/cms/category/insert',
        method: 'post',
        data: params
    })
}
// 删除栏目
export function categoryDelete(params) {
    return request({
        url: '/webadmin/cms/category/delete',
        method: 'DELETE',
        params
    })
}

// 文章管理接口
// 文章管理列表
export function artList(params) {
    return request({
        url: '/webadmin/cms/art/findAll',
        method: 'get',
        params
    })
}
// 上传文件
export function uploadFile(params) {
    return request({
        url: '/service/base/file/uploadFile',
        method: 'post',
        data: params
    })
}
// 文章管理添加
export function artAdd(params) {
    return request({
        url: '/webadmin/cms/art/insert',
        method: 'post',
        data: params
    })
}
// 文章管理详情
export function artDetails(params) {
    return request({
        url: '/webadmin/cms/art/findById',
        method: 'get',
        params
    })
}
// 文章删除
export function artDelete(params) {
    return request({
        url: '/webadmin/cms/art/delete',
        method: 'DELETE',
        params
    })
}
// 文章编辑
export function artEdit(params) {
    return request({
        url: '/webadmin/cms/art/update',
        method: 'put',
        data: params
    })
}